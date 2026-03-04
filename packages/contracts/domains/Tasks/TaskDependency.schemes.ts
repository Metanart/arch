import { z } from 'zod'

const TaskDependencySchema = z.object({
  id: z.string()
})

const UpdateTaskDependencyBaseSchema = z.object({
  id: z.string()
})

const CreateTaskDependencyBaseSchema = z.object({
  id: z.string()
})

export const TaskDependencyServerSchema = TaskDependencySchema

export const UpdateTaskDependencyServerSchema = UpdateTaskDependencyBaseSchema

export const CreateTaskDependencyServerSchema = CreateTaskDependencyBaseSchema

export type TaskDependencyServerDTO = z.infer<typeof TaskDependencyServerSchema>

export type UpdateTaskDependencyServerDTO = z.infer<typeof UpdateTaskDependencyServerSchema>

export type CreateTaskDependencyServerDTO = z.infer<typeof CreateTaskDependencyServerSchema>
