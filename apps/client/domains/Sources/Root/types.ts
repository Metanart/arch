import { SettingsClientDTO } from '@arch/contracts'

export type SettingsStore = {
  settings: SettingsClientDTO | null
  isLoading: boolean
  error: string | null
}

export const ConfigActionTypes = {
  Load: 'settings/load',
  Update: 'settings/update'
} as const
