import { createIpcInvoker, createIpcInvokerWithPayload } from '@shared/utils'
import { SettingsServerDTO, UpdateSettingsServerDTO } from '@arch/contracts'
import { SETTINGS_IPC_CHANNELS } from '@arch/enums'

export const settingsIpcInvokers = {
  [SETTINGS_IPC_CHANNELS.GET]: createIpcInvoker<SettingsServerDTO>(SETTINGS_IPC_CHANNELS.GET),
  [SETTINGS_IPC_CHANNELS.UPDATE]: createIpcInvokerWithPayload<
    SettingsServerDTO,
    UpdateSettingsServerDTO
  >(SETTINGS_IPC_CHANNELS.UPDATE)
} as const

export type SettingsIpcInvokers = typeof settingsIpcInvokers
