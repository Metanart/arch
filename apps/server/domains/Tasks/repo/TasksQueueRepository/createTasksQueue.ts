import {
  CreateTasksQueueServerDTO,
  TasksQueueServerDTO,
  TasksQueueServerSchema
} from '@arch/contracts'

import { createEntity } from 'domains/Shared/repos/createEntity'

import { TasksQueueEntity } from '../../entities/TasksQueueEntity'

export async function createTasksQueue(
  taskQueueDto: CreateTasksQueueServerDTO
): Promise<TasksQueueServerDTO> {
  return createEntity<TasksQueueEntity, TasksQueueServerDTO>(
    TasksQueueEntity,
    TasksQueueServerSchema,
    taskQueueDto
  )
}
