import {
  CreateTasksQueueServerDTO,
  TasksQueueServerDTO,
  TasksQueueServerSchema,
  UpdateTasksQueueServerDTO
} from '@arch/contracts'

import { createEntity, findEntities, findEntity, removeEntity, updateEntity } from '@domains/Shared'

import { TasksQueueEntity } from '../entities/TasksQueueEntity'

async function createTasksQueue(
  taskQueueDto: CreateTasksQueueServerDTO
): Promise<TasksQueueServerDTO> {
  return createEntity<TasksQueueEntity, TasksQueueServerDTO>(
    TasksQueueEntity,
    TasksQueueServerSchema,
    taskQueueDto
  )
}

async function getAllTasksQueues(): Promise<TasksQueueServerDTO[]> {
  return findEntities<TasksQueueEntity, TasksQueueServerDTO>(
    TasksQueueEntity,
    TasksQueueServerSchema
  )
}

async function getTasksQueueById(id: string): Promise<TasksQueueServerDTO> {
  return findEntity<TasksQueueEntity, TasksQueueServerDTO>(
    TasksQueueEntity,
    TasksQueueServerSchema,
    { id }
  )
}

async function updateTasksQueue(
  taskQueueDto: UpdateTasksQueueServerDTO
): Promise<TasksQueueServerDTO> {
  return updateEntity<TasksQueueEntity, TasksQueueServerDTO>(
    TasksQueueEntity,
    TasksQueueServerSchema,
    { id: taskQueueDto.id },
    taskQueueDto
  )
}

async function removeTasksQueue(id: string): Promise<boolean> {
  return removeEntity<TasksQueueEntity>(TasksQueueEntity, { id })
}

export const TasksQueueRepo = {
  create: createTasksQueue,
  getAll: getAllTasksQueues,
  getById: getTasksQueueById,
  update: updateTasksQueue,
  remove: removeTasksQueue
}
