import { z } from 'zod'

export const SettingsUpdateFormSchema = z.object({
  outputDir: z.string().min(3, 'Output directory is required'),
  tempDir: z.string().min(3, 'Temp directory is required'),
  maxThreads: z.number().min(1, 'Max threads is required').max(6, 'Max threads is required'),
  autoProcessOnScan: z.boolean(),
  autoArchiveOnComplete: z.boolean(),
  useMultithreading: z.boolean(),
  debugMode: z.boolean()
})
