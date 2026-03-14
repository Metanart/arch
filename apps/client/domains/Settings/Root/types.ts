import { TSettingsClientDTO } from '@arch/contracts'

export type TSettingsStore = {
  settings: TSettingsClientDTO | null
  isLoading: boolean
  error: string | null
}

export const ConfigActionTypes = {
  Load: 'settings/load',
  Update: 'settings/update'
} as const
