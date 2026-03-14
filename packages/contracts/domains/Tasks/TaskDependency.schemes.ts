import { z } from 'zod'

const TaskDependencySchema = z.object({
  id: z.string()
})

const UpdateTaskDependencyBaseSchema = z.object({
  id: z.string()
})

const CreateTaskDependencyBaseSchema = z.object({
  id: z.string().optional(),
  taskId: z.string(),
  dependsOnTaskId: z.string()
})

export const TaskDependencyServerSchema = TaskDependencySchema

export const UpdateTaskDependencyServerSchema = UpdateTaskDependencyBaseSchema

export const CreateTaskDependencyServerSchema = CreateTaskDependencyBaseSchema

export type TTaskDependencyServerDTO = z.infer<typeof TaskDependencyServerSchema>

export type TUpdateTaskDependencyServerDTO = z.infer<typeof UpdateTaskDependencyServerSchema>

export type TCreateTaskDependencyServerDTO = z.infer<typeof CreateTaskDependencyServerSchema>
