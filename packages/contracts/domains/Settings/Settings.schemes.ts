import { z } from 'zod'

const SettingsBaseSchema = z.object({
  id: z.string(),
  outputDir: z.string(),
  tempDir: z.string(),
  maxThreads: z.number(),
  autoProcessOnScan: z.boolean(),
  autoArchiveOnComplete: z.boolean(),
  useMultithreading: z.boolean(),
  debugMode: z.boolean()
})

const UpdateSettingsBaseSchema = z.object({
  id: z.string(),
  outputDir: z.string().min(3, 'Output directory is required'),
  tempDir: z.string().min(3, 'Temp directory is required'),
  maxThreads: z.number().min(1, 'Min 1 threads is required').max(6, 'Max 6 threads is required'),
  autoProcessOnScan: z.boolean(),
  autoArchiveOnComplete: z.boolean(),
  useMultithreading: z.boolean(),
  debugMode: z.boolean()
})

const CreateSettingsBaseSchema = z.object({
  outputDir: z.string().optional(),
  tempDir: z.string().optional(),
  maxThreads: z
    .number()
    .min(1, 'Max threads is required')
    .max(6, 'Max threads is required')
    .optional(),
  autoProcessOnScan: z.boolean().optional(),
  autoArchiveOnComplete: z.boolean().optional(),
  useMultithreading: z.boolean().optional(),
  debugMode: z.boolean().optional()
})

export const SettingsClientSchema = SettingsBaseSchema
export const SettingsServerSchema = SettingsBaseSchema

export const UpdateSettingsClientSchema = UpdateSettingsBaseSchema
export const UpdateSettingsServerSchema = UpdateSettingsBaseSchema

export const CreateSettingsClientSchema = CreateSettingsBaseSchema
export const CreateSettingsServerSchema = CreateSettingsBaseSchema

export type SettingsClientDTO = z.infer<typeof SettingsClientSchema>
export type SettingsServerDTO = z.infer<typeof SettingsServerSchema>

export type UpdateSettingsClientDTO = z.infer<typeof UpdateSettingsClientSchema>
export type UpdateSettingsServerDTO = z.infer<typeof UpdateSettingsServerSchema>

export type CreateSettingsClientDTO = z.infer<typeof CreateSettingsClientSchema>
export type CreateSettingsServerDTO = z.infer<typeof CreateSettingsServerSchema>
