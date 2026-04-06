import { TSettingsClientDTO, TUpdateSettingsClientDTO } from '@arch/contracts'
import { SETTINGS_IPC_CHANNELS } from '@arch/enums'

import { createIpcInvoker, createIpcInvokerWithPayload } from '@/Shared'

export const settingsIpcInvokers = {
  [SETTINGS_IPC_CHANNELS.GET]: createIpcInvoker<TSettingsClientDTO>(SETTINGS_IPC_CHANNELS.GET),
  [SETTINGS_IPC_CHANNELS.UPDATE]: createIpcInvokerWithPayload<
    TSettingsClientDTO,
    TUpdateSettingsClientDTO
  >(SETTINGS_IPC_CHANNELS.UPDATE)
} as const

export type TSettingsIpcInvokers = typeof settingsIpcInvokers
