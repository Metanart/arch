import { z } from 'zod'

import { TASKS_QUEUE_STATUS } from './enums'

const TasksQueueSchema = z.object({
  id: z.string(),
  status: z.enum(TASKS_QUEUE_STATUS)
})

const UpdateTasksQueueBaseSchema = z.object({
  id: z.string(),
  status: z.enum(TASKS_QUEUE_STATUS)
})

const CreateTasksQueueBaseSchema = z.object({
  status: z.enum(TASKS_QUEUE_STATUS)
})

export const TasksQueueServerSchema = TasksQueueSchema

export const UpdateTasksQueueServerSchema = UpdateTasksQueueBaseSchema

export const CreateTasksQueueServerSchema = CreateTasksQueueBaseSchema

export type TasksQueueServerDTO = z.infer<typeof TasksQueueServerSchema>

export type UpdateTasksQueueServerDTO = z.infer<typeof UpdateTasksQueueServerSchema>

export type CreateTasksQueueServerDTO = z.infer<typeof CreateTasksQueueServerSchema>
