import {
  CreateTasksQueueServerDTO,
  TasksQueueServerDTO,
  TasksQueueServerSchema,
  UpdateTasksQueueServerDTO
} from '@arch/contracts'

import {
  createEntity,
  getAllEntities,
  getEntity,
  removeEntity,
  updateEntity
} from '@domains/Shared'

import { TasksQueueEntity } from '../../entities/TasksQueueEntity'

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
  return getAllEntities<TasksQueueEntity, TasksQueueServerDTO>(
    TasksQueueEntity,
    TasksQueueServerSchema
  )
}

async function getTasksQueueById(id: string): Promise<TasksQueueServerDTO> {
  return getEntity<TasksQueueEntity, TasksQueueServerDTO>(
    TasksQueueEntity,
    { id },
    TasksQueueServerSchema
  )
}

async function updateTasksQueue(
  taskQueueDto: UpdateTasksQueueServerDTO
): Promise<TasksQueueServerDTO> {
  return updateEntity<TasksQueueEntity, TasksQueueServerDTO>(
    TasksQueueEntity,
    { id: taskQueueDto.id },
    TasksQueueServerSchema,
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
