import {
  CreateTaskServerDTO,
  TaskServerDTO,
  TaskServerSchema,
  UpdateTaskServerDTO
} from '@arch/contracts'

import { createEntity, findEntities, findEntity, removeEntity, updateEntity } from '@domains/Shared'

import { TaskEntity } from '../entities/TaskEntity'

async function createTask(taskQueueDto: CreateTaskServerDTO): Promise<TaskServerDTO> {
  return createEntity<TaskEntity, TaskServerDTO>(TaskEntity, TaskServerSchema, taskQueueDto)
}

async function getTaskById(id: string): Promise<TaskServerDTO> {
  return findEntity<TaskEntity, TaskServerDTO>(TaskEntity, TaskServerSchema, { id })
}

async function getTasksByQueueId(queueId: string): Promise<TaskServerDTO[]> {
  return findEntities<TaskEntity, TaskServerDTO>(TaskEntity, TaskServerSchema, {
    queue: { id: queueId }
  })
}

async function updateTask(taskQueueDto: UpdateTaskServerDTO): Promise<TaskServerDTO> {
  return updateEntity<TaskEntity, TaskServerDTO>(
    TaskEntity,
    TaskServerSchema,
    { id: taskQueueDto.id },
    taskQueueDto
  )
}

async function removeTask(id: string): Promise<boolean> {
  return removeEntity<TaskEntity>(TaskEntity, { id })
}

export const TaskRepo = {
  create: createTask,
  getById: getTaskById,
  getByQueueId: getTasksByQueueId,
  update: updateTask,
  remove: removeTask
}
