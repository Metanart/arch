import { z } from 'zod'

import { STATUS } from '../Shared/enums'

const TasksWorkflowSchema = z.object({
  id: z.string(),
  status: z.enum(STATUS)
})

const UpdateTasksWorkflowBaseSchema = z.object({
  id: z.string(),
  status: z.enum(STATUS)
})

const CreateTasksWorkflowBaseSchema = z.object({
  status: z.enum(STATUS)
})

export const TasksWorkflowServerSchema = TasksWorkflowSchema

export const UpdateTasksWorkflowServerSchema = UpdateTasksWorkflowBaseSchema

export const CreateTasksWorkflowServerSchema = CreateTasksWorkflowBaseSchema

export type TTasksWorkflowServerDTO = z.infer<typeof TasksWorkflowServerSchema>

export type TUpdateTasksWorkflowServerDTO = z.infer<typeof UpdateTasksWorkflowServerSchema>

export type TCreateTasksWorkflowServerDTO = z.infer<typeof CreateTasksWorkflowServerSchema>
