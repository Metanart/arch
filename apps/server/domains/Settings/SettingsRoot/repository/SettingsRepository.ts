import { getSettings } from './getSettings'
import { updateSettings } from './updateSettings'

export const SettingsRepo = {
  get: getSettings,
  update: updateSettings
}
