import { SettingsClientDTO, UpdateSettingsClientDTO } from '@arch/contracts'
import { SETTINGS_IPC_CHANNELS } from '@arch/enums'

import { createIpcInvoker, createIpcInvokerWithPayload } from '@domains/Shared'

export const settingsIpcInvokers = {
  [SETTINGS_IPC_CHANNELS.GET]: createIpcInvoker<SettingsClientDTO>(SETTINGS_IPC_CHANNELS.GET),
  [SETTINGS_IPC_CHANNELS.UPDATE]: createIpcInvokerWithPayload<
    SettingsClientDTO,
    UpdateSettingsClientDTO
  >(SETTINGS_IPC_CHANNELS.UPDATE)
} as const

export type SettingsIpcInvokers = typeof settingsIpcInvokers
