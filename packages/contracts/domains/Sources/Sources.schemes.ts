import { z } from 'zod'

const SourceBaseSchema = z.object({
  id: z.string(),
  path: z.string(),
  name: z.string(),
  comment: z.string().nullable()
})

const CreateSourceBaseSchema = z.object({
  path: z.string().min(3, 'Path is required'),
  name: z.string().min(3, 'Name is required'),
  comment: z.string().nullable()
})

const UpdateSourceBaseSchema = z.object({
  id: z.string(),
  path: z.string().min(3, 'Path is required'),
  name: z.string().min(3, 'Name is required'),
  comment: z.string().nullable()
})

export const SourceClientSchema = SourceBaseSchema
export const SourceServerSchema = SourceBaseSchema

export const CreateSourceClientSchema = CreateSourceBaseSchema
export const CreateSourceServerSchema = CreateSourceBaseSchema

export const UpdateSourceClientSchema = UpdateSourceBaseSchema
export const UpdateSourceServerSchema = UpdateSourceBaseSchema

export type TSourceClientDTO = z.infer<typeof SourceClientSchema>
export type TSourceServerDTO = z.infer<typeof SourceServerSchema>

export type TCreateSourceClientDTO = z.infer<typeof CreateSourceClientSchema>
export type TCreateSourceServerDTO = z.infer<typeof CreateSourceServerSchema>

export type TUpdateSourceClientDTO = z.infer<typeof UpdateSourceClientSchema>
export type TUpdateSourceServerDTO = z.infer<typeof UpdateSourceServerSchema>
