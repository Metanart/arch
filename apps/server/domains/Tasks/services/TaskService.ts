import { LessThanOrEqual } from 'typeorm'

import { STATUS, TaskType } from '@arch/contracts'
import { AppError } from '@arch/utils'

import { getDataSource } from '@domains/App'

import { TaskDependencyEntity } from '../entities/TaskDependencyEntity'
import { TaskEntity } from '../entities/TaskEntity'
import { TaskDependencyRepo } from '../repo/TaskDependencyRepo'
import { TaskRepo } from '../repo/TaskRepo'

const appContext = { domain: 'Tasks' as const, layer: 'Service' as const, origin: 'TaskService' }

function ensureTaskFound(task: TaskEntity | null, taskId: string): asserts task is TaskEntity {
  if (!task) {
    throw new AppError({
      ...appContext,
      code: 'TASK_NOT_FOUND',
      message: `Task not found: ${taskId}`
    })
  }
}

function ensureTakenBy(task: TaskEntity, workerId: string): void {
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
    type: TaskType
    payload: unknown
    priority?: number
    predictedWeight?: number
    maxAttempts?: number
    dependsOnTaskIds?: string[]
  }): Promise<TaskEntity>

  createTasksBatch(input: {
    workflowId: string
    tasks: Array<{
      type: TaskType
      payload: unknown
      priority?: number
      predictedWeight?: number
      maxAttempts?: number
      dependsOnTaskIds?: string[]
    }>
  }): Promise<TaskEntity[]>

  claimNextRunnableTask(input: {
    workerId: string
    now: Date
    leaseDurationMs: number
  }): Promise<TaskEntity | null>

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

  getTaskById(taskId: string): Promise<TaskEntity | null>

  getTasksByWorkflow(workflowId: string): Promise<TaskEntity[]>

  areDependenciesResolved(taskId: string): Promise<boolean>
}

async function areDependenciesResolved(taskId: string): Promise<boolean> {
  const depIds = await TaskDependencyRepo.getDependencyTaskIdsByTaskId(taskId)
  if (depIds.length === 0) return true
  for (const id of depIds) {
    const task = await TaskRepo.getByIdOrNull(id)
    if (!task || task.status !== STATUS.COMPLETED) return false
  }
  return true
}

export class TaskService implements ITaskService {
  async createTask(input: {
    workflowId: string
    type: TaskType
    payload: unknown
    priority?: number
    predictedWeight?: number
    maxAttempts?: number
    dependsOnTaskIds?: string[]
  }): Promise<TaskEntity> {
    const payload = JSON.stringify(input.payload)
    return getDataSource().transaction(async (manager) => {
      const taskRepo = manager.getRepository(TaskEntity)
      const depRepo = manager.getRepository(TaskDependencyEntity)
      const taskPayload = {
        workflowId: input.workflowId,
        type: input.type,
        status: STATUS.PENDING,
        payload,
        priority: input.priority ?? 0,
        predictedWeight: input.predictedWeight ?? 0,
        maxAttempts: input.maxAttempts ?? 3,
        nextRunAt: new Date()
      }
      const savedTask = await taskRepo.save(taskRepo.create(taskPayload))
      const depPayloads = (input.dependsOnTaskIds ?? []).map((dependsOnTaskId) => ({
        taskId: savedTask.id,
        dependsOnTaskId
      }))
      if (depPayloads.length > 0) {
        await depRepo.save(depRepo.create(depPayloads))
      }
      return savedTask
    })
  }

  async createTasksBatch(input: {
    workflowId: string
    tasks: Array<{
      type: TaskType
      payload: unknown
      priority?: number
      predictedWeight?: number
      maxAttempts?: number
      dependsOnTaskIds?: string[]
    }>
  }): Promise<TaskEntity[]> {
    const now = new Date()
    return getDataSource().transaction(async (manager) => {
      const taskRepo = manager.getRepository(TaskEntity)
      const depRepo = manager.getRepository(TaskDependencyEntity)
      const taskRows: Array<Partial<TaskEntity>> = input.tasks.map((t) => ({
        workflowId: input.workflowId,
        type: t.type,
        status: STATUS.PENDING,
        payload: JSON.stringify(t.payload),
        priority: t.priority ?? 0,
        predictedWeight: t.predictedWeight ?? 0,
        maxAttempts: t.maxAttempts ?? 3,
        nextRunAt: now
      }))
      const savedTasks = await taskRepo.save(taskRepo.create(taskRows))
      const deps: Array<{ taskId: string; dependsOnTaskId: string }> = []
      input.tasks.forEach((t, i) => {
        const taskId = savedTasks[i]!.id
        for (const dependsOnTaskId of t.dependsOnTaskIds ?? []) {
          deps.push({ taskId, dependsOnTaskId })
        }
      })
      if (deps.length > 0) {
        await depRepo.save(depRepo.create(deps))
      }
      return savedTasks
    })
  }

  async claimNextRunnableTask(input: {
    workerId: string
    now: Date
    leaseDurationMs: number
  }): Promise<TaskEntity | null> {
    const repo = getDataSource().getRepository(TaskEntity)
    const allPending = await repo.find({
      where: {
        status: STATUS.PENDING,
        nextRunAt: LessThanOrEqual(input.now)
      },
      order: { priority: 'DESC' }
    })
    const candidates = allPending.filter(
      (t) => t.leaseUntil == null || t.leaseUntil.getTime() < input.now.getTime()
    )
    for (const task of candidates) {
      const resolved = await areDependenciesResolved(task.id)
      if (!resolved) continue
      const updated = await getDataSource().transaction(async (manager) => {
        const em = manager.getRepository(TaskEntity)
        const result = await em.update(
          { id: task.id, status: STATUS.PENDING },
          {
            takenBy: input.workerId,
            leaseUntil: new Date(input.now.getTime() + input.leaseDurationMs),
            status: STATUS.RUNNING
          }
        )
        if (result.affected !== 1) return null
        return em.findOne({ where: { id: task.id } })
      })
      if (updated) return updated
    }
    return null
  }

  async heartbeat(input: {
    taskId: string
    workerId: string
    now: Date
    leaseDurationMs: number
  }): Promise<void> {
    const task = await TaskRepo.getByIdOrNull(input.taskId)
    ensureTaskFound(task, input.taskId)
    if (task.takenBy !== input.workerId) {
      throw new AppError({
        ...appContext,
        code: 'TASK_NOT_OWNED_BY_WORKER',
        message: `Task ${input.taskId} is not owned by worker ${input.workerId}`
      })
    }
    if (task.status !== STATUS.RUNNING) {
      throw new AppError({
        ...appContext,
        code: 'TASK_NOT_RUNNING',
        message: `Task ${input.taskId} is not RUNNING`
      })
    }
    await TaskRepo.update({
      id: input.taskId,
      status: task.status,
      leaseUntil: new Date(input.now.getTime() + input.leaseDurationMs)
    })
  }

  async completeTask(input: { taskId: string; workerId: string; finishedAt: Date }): Promise<void> {
    const task = await TaskRepo.getByIdOrNull(input.taskId)
    ensureTaskFound(task, input.taskId)
    ensureTakenBy(task, input.workerId)
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
    const task = await TaskRepo.getByIdOrNull(input.taskId)
    ensureTaskFound(task, input.taskId)
    ensureTakenBy(task, input.workerId)
    const attempts = task.attempts + 1
    const nextRunAt = new Date(input.now.getTime() + 1000 * Math.pow(2, attempts))
    if (attempts >= task.maxAttempts) {
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
    const task = await TaskRepo.getByIdOrNull(taskId)
    ensureTaskFound(task, taskId)
    if (task.status !== STATUS.PENDING && task.status !== STATUS.RUNNING) {
      throw new AppError({
        ...appContext,
        code: 'INVALID_TASK_STATE',
        message: `Task ${taskId} cannot be paused from status ${task.status}`
      })
    }
    await TaskRepo.update({ id: taskId, status: STATUS.PAUSED })
  }

  async resumeTask(taskId: string): Promise<void> {
    const task = await TaskRepo.getByIdOrNull(taskId)
    ensureTaskFound(task, taskId)
    if (task.status !== STATUS.PAUSED) {
      throw new AppError({
        ...appContext,
        code: 'INVALID_TASK_STATE',
        message: `Task ${taskId} is not PAUSED, cannot resume`
      })
    }
    await TaskRepo.update({ id: taskId, status: STATUS.PENDING, nextRunAt: new Date() })
  }

  async cancelTask(taskId: string): Promise<void> {
    const task = await TaskRepo.getByIdOrNull(taskId)
    ensureTaskFound(task, taskId)
    await TaskRepo.update({
      id: taskId,
      status: STATUS.CANCELED,
      takenBy: null,
      leaseUntil: null
    })
  }

  async getTaskById(taskId: string): Promise<TaskEntity | null> {
    return TaskRepo.getByIdOrNull(taskId)
  }

  async getTasksByWorkflow(workflowId: string): Promise<TaskEntity[]> {
    return TaskRepo.getByWorkflowId(workflowId)
  }

  async areDependenciesResolved(taskId: string): Promise<boolean> {
    return areDependenciesResolved(taskId)
  }
}
