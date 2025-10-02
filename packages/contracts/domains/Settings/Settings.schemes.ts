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

const SettingsUpdateBaseSchema = z.object({
  id: z.string(),
  outputDir: z.string().min(3, 'Output directory is required'),
  tempDir: z.string().min(3, 'Temp directory is required'),
  maxThreads: z.number().min(1, 'Max threads is required').max(6, 'Max threads is required'),
  autoProcessOnScan: z.boolean(),
  autoArchiveOnComplete: z.boolean(),
  useMultithreading: z.boolean(),
  debugMode: z.boolean()
})

export const SettingsClientSchema = SettingsBaseSchema
export const SettingsServerSchema = SettingsBaseSchema

export const SettingsUpdateClientSchema = SettingsUpdateBaseSchema
export const SettingsUpdateServerSchema = SettingsUpdateBaseSchema
