import { z } from 'zod'

import { STATUS } from '../Shared/enums'

import { TASK_TYPE } from './enums'

const TaskSchema = z.object({
  id: z.string(),
  type: z.enum(TASK_TYPE),
  status: z.enum(STATUS),
  payload: z.string(),
  workflowId: z.string(),
  priority: z.number().optional(),
  predictedWeight: z.number().optional(),
  maxAttempts: z.number().optional(),
  takenBy: z.string().nullable().optional(),
  leaseUntil: z.date().nullable().optional(),
  attempts: z.number().optional(),
  nextRunAt: z.date().nullable().optional(),
  error: z.string().nullable().optional()
})

const UpdateTaskBaseSchema = z.object({
  id: z.string(),
  status: z.enum(STATUS),
  leaseUntil: z.date().nullable().optional(),
  takenBy: z.string().nullable().optional(),
  attempts: z.number().optional(),
  nextRunAt: z.date().nullable().optional(),
  error: z.string().nullable().optional()
})

const CreateTaskBaseSchema = z.object({
  type: z.enum(TASK_TYPE),
  status: z.enum(STATUS),
  payload: z.string(),
  workflowId: z.string(),
  priority: z.number().optional(),
  predictedWeight: z.number().optional(),
  maxAttempts: z.number().optional(),
  nextRunAt: z.date().optional()
})

export const TaskServerSchema = TaskSchema

export const UpdateTaskServerSchema = UpdateTaskBaseSchema

export const CreateTaskServerSchema = CreateTaskBaseSchema

export type TTaskServerDTO = z.infer<typeof TaskServerSchema>

export type TUpdateTaskServerDTO = z.infer<typeof UpdateTaskServerSchema>

export type TCreateTaskServerDTO = z.infer<typeof CreateTaskServerSchema>
