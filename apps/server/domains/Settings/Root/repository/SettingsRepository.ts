import { getSettings } from './getSettings'
import { updateSettings } from './updateSettings'

export const SettingsRepository = {
  get: getSettings,
  update: updateSettings
}
