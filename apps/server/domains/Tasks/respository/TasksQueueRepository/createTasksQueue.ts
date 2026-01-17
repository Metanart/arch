import {
  CreateTasksQueueServerDTO,
  TasksQueueServerDTO,
  TasksQueueServerSchema
} from '@arch/contracts'
import { AppContext } from '@arch/types'

import { createEntity } from 'domains/Shared/repos/createEntity'

import { TasksQueueEntity } from '../../entities/TasksQueueEntity'

const appContext: AppContext = {
  domain: 'Tasks',
  layer: 'Database',
  origin: 'createTasksQueue'
}

export async function createTasksQueue(
  newTasksQueue: CreateTasksQueueServerDTO
): Promise<TasksQueueServerDTO> {
  return createEntity<TasksQueueEntity, TasksQueueServerDTO>(
    newTasksQueue,
    TasksQueueEntity,
    TasksQueueServerSchema,
    appContext
  )
}
