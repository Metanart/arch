import {
  CreateTasksQueueServerDTO,
  TasksQueueServerDTO,
  TasksQueueServerSchema
} from '@arch/contracts'

import { createEntity } from 'domains/Shared/repo/createEntity'
import { TasksQueueEntity } from 'domains/Tasks/entities/TasksQueueEntity'

export async function createTasksQueue(
  taskQueueDto: CreateTasksQueueServerDTO
): Promise<TasksQueueServerDTO> {
  return createEntity<TasksQueueEntity, TasksQueueServerDTO>(
    TasksQueueEntity,
    TasksQueueServerSchema,
    taskQueueDto
  )
}

export const TasksQueueRepo = {
  create: createTasksQueue
}
