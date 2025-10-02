import z from 'zod'

import { SettingsUpdateFormSchema } from '../schemes/SettingsSchemes'

export type SettingsDTO = {
  outputDir: string
  tempDir: string
  maxThreads: number
  autoProcessOnScan: boolean
  autoArchiveOnComplete: boolean
  useMultithreading: boolean
  debugMode: boolean
}

export type SettingsFormDTO = {
  outputDir: string
  tempDir: string
  maxThreads: number
  autoProcessOnScan: boolean
  autoArchiveOnComplete: boolean
  useMultithreading: boolean
  debugMode: boolean
}

export type SettingsUpdateDTO = {
  outputDir?: string
  tempDir?: string
  maxThreads?: number
  autoProcessOnScan?: boolean
  autoArchiveOnComplete?: boolean
  useMultithreading?: boolean
  debugMode?: boolean
}

export type SettingsUpdateFormDTO = z.infer<typeof SettingsUpdateFormSchema>

export enum SETTINGS_CONTRACTS_KEYS {
  SettingsEntity = 'SettingsEntity',
  SettingsDTO = 'SettingsDTO',
  SettingsFormDTO = 'SettingsFormDTO',
  SettingsUpdateDTO = 'SettingsUpdateDTO',
  SettingsUpdateFormDTO = 'SettingsUpdateFormDTO'
}
