import { LessThanOrEqual } from 'typeorm'

import {
  STATUS,
  TaskServerSchema,
  TCreateTaskServerDTO,
  TTaskServerDTO,
  TTaskType,
  TUpdateTaskServerDTO
} from '@arch/contracts'

import {
  createEntity,
  createEntityBatch,
  findEntities,
  removeEntity,
  updateEntity
} from '@domains/Shared'

import { getDataSource } from '@domains/App'

import { TaskDependencyEntity } from '../entities/TaskDependencyEntity'
import { TaskEntity } from '../entities/TaskEntity'

async function createTask(taskDto: TCreateTaskServerDTO): Promise<TTaskServerDTO> {
  return createEntity<TaskEntity, TTaskServerDTO>(TaskEntity, TaskServerSchema, taskDto)
}

async function getByIdOrNull(id: string): Promise<TTaskServerDTO | null> {
  const taskRepository = getDataSource().getRepository(TaskEntity)
  const entity = await taskRepository.findOne({ where: { id } })
  if (!entity) return null
  return TaskServerSchema.parse(entity)
}

async function getByWorkflowId(workflowId: string): Promise<TTaskServerDTO[]> {
  return findEntities<TaskEntity, TTaskServerDTO>(TaskEntity, TaskServerSchema, { workflowId })
}

async function updateTask(taskDto: TUpdateTaskServerDTO): Promise<TTaskServerDTO> {
  return updateEntity<TaskEntity, TTaskServerDTO>(
    TaskEntity,
    TaskServerSchema,
    { id: taskDto.id },
    taskDto
  )
}

async function removeTask(id: string): Promise<boolean> {
  return removeEntity<TaskEntity>(TaskEntity, { id })
}

async function getPendingRunnable(now: Date): Promise<TTaskServerDTO[]> {
  const taskRepository = getDataSource().getRepository(TaskEntity)
  const entities = await taskRepository.find({
    where: {
      status: STATUS.PENDING,
      nextRunAt: LessThanOrEqual(now)
    },
    order: { priority: 'DESC' }
  })
  return entities.map((entity) => TaskServerSchema.parse(entity))
}

async function tryClaimTask(
  taskId: string,
  workerId: string,
  now: Date,
  leaseDurationMs: number
): Promise<TTaskServerDTO | null> {
  return getDataSource().transaction(async (entityManager) => {
    const taskRepository = entityManager.getRepository(TaskEntity)
    const result = await taskRepository.update(
      { id: taskId, status: STATUS.PENDING },
      {
        takenBy: workerId,
        leaseUntil: new Date(now.getTime() + leaseDurationMs),
        status: STATUS.RUNNING
      }
    )
    if (result.affected !== 1) return null
    const entity = await taskRepository.findOne({ where: { id: taskId } })
    return entity ? TaskServerSchema.parse(entity) : null
  })
}

type CreateTaskWithDependenciesInput = {
  workflowId: string
  type: TTaskType
  payload: string
  priority?: number
  predictedWeight?: number
  maxAttempts?: number
  dependsOnTaskIds?: string[]
}

async function createTaskWithDependencies(
  input: CreateTaskWithDependenciesInput
): Promise<TTaskServerDTO> {
  return getDataSource().transaction(async (entityManager) => {
    const taskRepository = entityManager.getRepository(TaskEntity)
    const taskDependencyRepository = entityManager.getRepository(TaskDependencyEntity)
    const taskPayload = {
      workflowId: input.workflowId,
      type: input.type,
      status: STATUS.PENDING,
      payload: input.payload,
      priority: input.priority ?? 0,
      predictedWeight: input.predictedWeight ?? 0,
      maxAttempts: input.maxAttempts ?? 3,
      nextRunAt: new Date()
    }
    const savedTask = await taskRepository.save(taskRepository.create(taskPayload))
    const dependencyPayloads = (input.dependsOnTaskIds ?? []).map((dependsOnTaskId) => ({
      taskId: savedTask.id,
      dependsOnTaskId
    }))
    if (dependencyPayloads.length > 0) {
      await taskDependencyRepository.save(taskDependencyRepository.create(dependencyPayloads))
    }
    return TaskServerSchema.parse(savedTask)
  })
}

type CreateTasksBatchTaskInput = {
  type: TTaskType
  payload: string
  priority?: number
  predictedWeight?: number
  maxAttempts?: number
  dependsOnTaskIds?: string[]
}

type CreateTasksBatchInput = {
  workflowId: string
  tasks: CreateTasksBatchTaskInput[]
}

async function createTasksBatch(input: CreateTasksBatchInput): Promise<TTaskServerDTO[]> {
  const now = new Date()
  const taskRows: Array<Partial<TaskEntity>> = input.tasks.map((taskInput) => ({
    workflowId: input.workflowId,
    type: taskInput.type,
    status: STATUS.PENDING,
    payload: taskInput.payload,
    priority: taskInput.priority ?? 0,
    predictedWeight: taskInput.predictedWeight ?? 0,
    maxAttempts: taskInput.maxAttempts ?? 3,
    nextRunAt: now
  }))
  return getDataSource().transaction(async (entityManager) => {
    const savedTasks = await createEntityBatch<TaskEntity, TTaskServerDTO>(
      TaskEntity,
      TaskServerSchema,
      taskRows,
      entityManager
    )
    const taskDependencyRepository = entityManager.getRepository(TaskDependencyEntity)
    const dependencyPayloads: Array<{ taskId: string; dependsOnTaskId: string }> = []
    input.tasks.forEach((taskInput, index) => {
      const taskId = savedTasks[index]!.id
      for (const dependsOnTaskId of taskInput.dependsOnTaskIds ?? []) {
        dependencyPayloads.push({ taskId, dependsOnTaskId })
      }
    })
    if (dependencyPayloads.length > 0) {
      await taskDependencyRepository.save(taskDependencyRepository.create(dependencyPayloads))
    }
    return savedTasks
  })
}

export const TaskRepo = {
  create: createTask,
  getByIdOrNull,
  getByWorkflowId,
  getPendingRunnable,
  tryClaimTask,
  createTaskWithDependencies,
  createTasksBatch,
  update: updateTask,
  remove: removeTask
}
