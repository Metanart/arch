import { z } from 'zod'

import { TASK_STATUS, TASK_TYPE } from './enums'

const TaskSchema = z.object({
  id: z.string(),
  type: z.enum(TASK_TYPE),
  status: z.enum(TASK_STATUS),
  payload: z.string(),
  queueId: z.string()
})

const UpdateTaskBaseSchema = z.object({
  id: z.string(),
  status: z.enum(TASK_STATUS)
})

const CreateTaskBaseSchema = z.object({
  type: z.enum(TASK_TYPE),
  status: z.enum(TASK_STATUS),
  payload: z.string(),
  queueId: z.string()
})

export const TaskServerSchema = TaskSchema

export const UpdateTaskServerSchema = UpdateTaskBaseSchema

export const CreateTaskServerSchema = CreateTaskBaseSchema

export type TaskServerDTO = z.infer<typeof TaskServerSchema>

export type UpdateTaskServerDTO = z.infer<typeof UpdateTaskServerSchema>

export type CreateTaskServerDTO = z.infer<typeof CreateTaskServerSchema>
