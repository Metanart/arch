import { LessThanOrEqual } from 'typeorm'

import {
  STATUS,
  TaskServerSchema,
  TCreateTaskServerDTO,
  TTaskServerDTO,
  TTaskType,
  TUpdateTaskServerDTO
} from '@arch/contracts'

import { createEntity, findEntities, removeEntity, updateEntity } from '@domains/Shared'

import { getDataSource } from '@domains/App'

import { TaskDependencyEntity } from '../entities/TaskDependencyEntity'
import { TaskEntity } from '../entities/TaskEntity'

async function createTask(taskDto: TCreateTaskServerDTO): Promise<TTaskServerDTO> {
  return createEntity<TaskEntity, TTaskServerDTO>(TaskEntity, TaskServerSchema, taskDto)
}

async function getByIdOrNull(id: string): Promise<TTaskServerDTO | null> {
  const repo = getDataSource().getRepository(TaskEntity)
  const entity = await repo.findOne({ where: { id } })
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
  const repo = getDataSource().getRepository(TaskEntity)
  const entities = await repo.find({
    where: {
      status: STATUS.PENDING,
      nextRunAt: LessThanOrEqual(now)
    },
    order: { priority: 'DESC' }
  })
  return entities.map((e) => TaskServerSchema.parse(e))
}

async function tryClaimTask(
  taskId: string,
  workerId: string,
  now: Date,
  leaseDurationMs: number
): Promise<TTaskServerDTO | null> {
  return getDataSource().transaction(async (manager) => {
    const em = manager.getRepository(TaskEntity)
    const result = await em.update(
      { id: taskId, status: STATUS.PENDING },
      {
        takenBy: workerId,
        leaseUntil: new Date(now.getTime() + leaseDurationMs),
        status: STATUS.RUNNING
      }
    )
    if (result.affected !== 1) return null
    const entity = await em.findOne({ where: { id: taskId } })
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
  return getDataSource().transaction(async (manager) => {
    const taskRepo = manager.getRepository(TaskEntity)
    const depRepo = manager.getRepository(TaskDependencyEntity)
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
    const savedTask = await taskRepo.save(taskRepo.create(taskPayload))
    const depPayloads = (input.dependsOnTaskIds ?? []).map((dependsOnTaskId) => ({
      taskId: savedTask.id,
      dependsOnTaskId
    }))
    if (depPayloads.length > 0) {
      await depRepo.save(depRepo.create(depPayloads))
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
  return getDataSource().transaction(async (manager) => {
    const taskRepo = manager.getRepository(TaskEntity)
    const depRepo = manager.getRepository(TaskDependencyEntity)
    const taskRows: Array<Partial<TaskEntity>> = input.tasks.map((t) => ({
      workflowId: input.workflowId,
      type: t.type,
      status: STATUS.PENDING,
      payload: t.payload,
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
    return savedTasks.map((entity) => TaskServerSchema.parse(entity))
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
