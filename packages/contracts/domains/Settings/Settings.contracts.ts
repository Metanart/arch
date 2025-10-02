import { z } from 'zod'
import {
  SettingsClientSchema,
  SettingsUpdateClientSchema,
  SettingsServerSchema,
  SettingsUpdateServerSchema
} from './Settings.schemes'

export type TSettingsClientDTO = z.infer<typeof SettingsClientSchema>
export type TSettingsServerDTO = z.infer<typeof SettingsServerSchema>

export type TSettingsUpdateClientDTO = z.infer<typeof SettingsUpdateClientSchema>
export type TSettingsUpdateServerDTO = z.infer<typeof SettingsUpdateServerSchema>
