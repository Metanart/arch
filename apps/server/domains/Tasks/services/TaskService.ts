import { STATUS, TTaskServerDTO, TTaskType } from '@arch/contracts'
import { AppError } from '@arch/utils'

import { TaskDependencyRepo } from '../repo/TaskDependencyRepo'
import { TaskRepo } from '../repo/TaskRepo'

const appContext = { domain: 'Tasks' as const, layer: 'Service' as const, origin: 'TaskService' }

function ensureTaskFound(
  task: TTaskServerDTO | null,
  taskId: string
): asserts task is TTaskServerDTO {
  if (!task) {
    throw new AppError({
      ...appContext,
      code: 'TASK_NOT_FOUND',
      message: `Task not found: ${taskId}`
    })
  }
}

function ensureTakenBy(task: TTaskServerDTO, workerId: string): void {
  if (task.takenBy !== workerId) {
    throw new AppError({
      ...appContext,
      code: 'TASK_NOT_OWNED_BY_WORKER',
      message: `Task ${task.id} is not owned by worker ${workerId}`
    })
  }
}

export interface ITaskService {
  createTask(input: {
    workflowId: string
    type: TTaskType
    payload: unknown
    priority?: number
    predictedWeight?: number
    maxAttempts?: number
    dependsOnTaskIds?: string[]
  }): Promise<TTaskServerDTO>

  createTasksBatch(input: {
    workflowId: string
    tasks: Array<{
      type: TTaskType
      payload: unknown
      priority?: number
      predictedWeight?: number
      maxAttempts?: number
      dependsOnTaskIds?: string[]
    }>
  }): Promise<TTaskServerDTO[]>

  claimNextRunnableTask(input: {
    workerId: string
    now: Date
    leaseDurationMs: number
  }): Promise<TTaskServerDTO | null>

  heartbeat(input: {
    taskId: string
    workerId: string
    now: Date
    leaseDurationMs: number
  }): Promise<void>

  completeTask(input: { taskId: string; workerId: string; finishedAt: Date }): Promise<void>

  failTask(input: { taskId: string; workerId: string; error: string; now: Date }): Promise<void>

  pauseTask(taskId: string): Promise<void>

  resumeTask(taskId: string): Promise<void>

  cancelTask(taskId: string): Promise<void>

  getTaskById(taskId: string): Promise<TTaskServerDTO | null>

  getTasksByWorkflow(workflowId: string): Promise<TTaskServerDTO[]>

  areDependenciesResolved(taskId: string): Promise<boolean>
}

async function areDependenciesResolved(taskId: string): Promise<boolean> {
  const dependencyTaskIds = await TaskDependencyRepo.getDependencyTaskIdsByTaskId(taskId)
  if (dependencyTaskIds.length === 0) return true
  for (const dependencyTaskId of dependencyTaskIds) {
    const taskDto = await TaskRepo.getByIdOrNull(dependencyTaskId)
    if (!taskDto || taskDto.status !== STATUS.COMPLETED) return false
  }
  return true
}

export class TaskService implements ITaskService {
  async createTask(input: {
    workflowId: string
    type: TTaskType
    payload: unknown
    priority?: number
    predictedWeight?: number
    maxAttempts?: number
    dependsOnTaskIds?: string[]
  }): Promise<TTaskServerDTO> {
    const payload = JSON.stringify(input.payload)
    return TaskRepo.createTaskWithDependencies({
      workflowId: input.workflowId,
      type: input.type,
      payload,
      priority: input.priority,
      predictedWeight: input.predictedWeight,
      maxAttempts: input.maxAttempts,
      dependsOnTaskIds: input.dependsOnTaskIds
    })
  }

  async createTasksBatch(input: {
    workflowId: string
    tasks: Array<{
      type: TTaskType
      payload: unknown
      priority?: number
      predictedWeight?: number
      maxAttempts?: number
      dependsOnTaskIds?: string[]
    }>
  }): Promise<TTaskServerDTO[]> {
    return TaskRepo.createTasksBatch({
      workflowId: input.workflowId,
      tasks: input.tasks.map((taskInput) => ({
        type: taskInput.type,
        payload: JSON.stringify(taskInput.payload),
        priority: taskInput.priority,
        predictedWeight: taskInput.predictedWeight,
        maxAttempts: taskInput.maxAttempts,
        dependsOnTaskIds: taskInput.dependsOnTaskIds
      }))
    })
  }

  async claimNextRunnableTask(input: {
    workerId: string
    now: Date
    leaseDurationMs: number
  }): Promise<TTaskServerDTO | null> {
    const candidates = await TaskRepo.getPendingRunnable(input.now)
    const available = candidates.filter(
      (candidateTaskDto) =>
        candidateTaskDto.leaseUntil == null ||
        candidateTaskDto.leaseUntil.getTime() < input.now.getTime()
    )
    for (const candidateTaskDto of available) {
      const resolved = await areDependenciesResolved(candidateTaskDto.id)
      if (!resolved) continue
      const claimed = await TaskRepo.tryClaimTask(
        candidateTaskDto.id,
        input.workerId,
        input.now,
        input.leaseDurationMs
      )
      if (claimed) return claimed
    }
    return null
  }

  async heartbeat(input: {
    taskId: string
    workerId: string
    now: Date
    leaseDurationMs: number
  }): Promise<void> {
    const taskDto = await TaskRepo.getByIdOrNull(input.taskId)
    ensureTaskFound(taskDto, input.taskId)
    if (taskDto.takenBy !== input.workerId) {
      throw new AppError({
        ...appContext,
        code: 'TASK_NOT_OWNED_BY_WORKER',
        message: `Task ${input.taskId} is not owned by worker ${input.workerId}`
      })
    }
    if (taskDto.status !== STATUS.RUNNING) {
      throw new AppError({
        ...appContext,
        code: 'TASK_NOT_RUNNING',
        message: `Task ${input.taskId} is not RUNNING`
      })
    }
    await TaskRepo.update({
      id: input.taskId,
      status: taskDto.status,
      leaseUntil: new Date(input.now.getTime() + input.leaseDurationMs)
    })
  }

  async completeTask(input: { taskId: string; workerId: string; finishedAt: Date }): Promise<void> {
    const taskDto = await TaskRepo.getByIdOrNull(input.taskId)
    ensureTaskFound(taskDto, input.taskId)
    ensureTakenBy(taskDto, input.workerId)
    await TaskRepo.update({
      id: input.taskId,
      status: STATUS.COMPLETED,
      takenBy: null,
      leaseUntil: null
    })
  }

  async failTask(input: {
    taskId: string
    workerId: string
    error: string
    now: Date
  }): Promise<void> {
    const taskDto = await TaskRepo.getByIdOrNull(input.taskId)
    ensureTaskFound(taskDto, input.taskId)
    ensureTakenBy(taskDto, input.workerId)
    const attempts = (taskDto.attempts ?? 0) + 1
    const maxAttempts = taskDto.maxAttempts ?? 3
    const nextRunAt = new Date(input.now.getTime() + 1000 * Math.pow(2, attempts))
    if (attempts >= maxAttempts) {
      await TaskRepo.update({
        id: input.taskId,
        status: STATUS.FAILED,
        takenBy: null,
        leaseUntil: null,
        error: input.error,
        attempts,
        nextRunAt: null
      })
    } else {
      await TaskRepo.update({
        id: input.taskId,
        status: STATUS.PENDING,
        takenBy: null,
        leaseUntil: null,
        error: input.error,
        attempts,
        nextRunAt
      })
    }
  }

  async pauseTask(taskId: string): Promise<void> {
    const taskDto = await TaskRepo.getByIdOrNull(taskId)
    ensureTaskFound(taskDto, taskId)
    if (taskDto.status !== STATUS.PENDING && taskDto.status !== STATUS.RUNNING) {
      throw new AppError({
        ...appContext,
        code: 'INVALID_TASK_STATE',
        message: `Task ${taskId} cannot be paused from status ${taskDto.status}`
      })
    }
    await TaskRepo.update({ id: taskId, status: STATUS.PAUSED })
  }

  async resumeTask(taskId: string): Promise<void> {
    const taskDto = await TaskRepo.getByIdOrNull(taskId)
    ensureTaskFound(taskDto, taskId)
    if (taskDto.status !== STATUS.PAUSED) {
      throw new AppError({
        ...appContext,
        code: 'INVALID_TASK_STATE',
        message: `Task ${taskId} is not PAUSED, cannot resume`
      })
    }
    await TaskRepo.update({ id: taskId, status: STATUS.PENDING, nextRunAt: new Date() })
  }

  async cancelTask(taskId: string): Promise<void> {
    const taskDto = await TaskRepo.getByIdOrNull(taskId)
    ensureTaskFound(taskDto, taskId)
    await TaskRepo.update({
      id: taskId,
      status: STATUS.CANCELED,
      takenBy: null,
      leaseUntil: null
    })
  }

  async getTaskById(taskId: string): Promise<TTaskServerDTO | null> {
    return TaskRepo.getByIdOrNull(taskId)
  }

  async getTasksByWorkflow(workflowId: string): Promise<TTaskServerDTO[]> {
    return TaskRepo.getByWorkflowId(workflowId)
  }

  async areDependenciesResolved(taskId: string): Promise<boolean> {
    return areDependenciesResolved(taskId)
  }
}
