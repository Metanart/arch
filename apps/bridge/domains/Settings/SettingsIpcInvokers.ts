import { createIpcInvoker, createIpcInvokerWithPayload } from '@shared/ipc'
import { TSettingsServerDTO, TUpdateSettingsServerDTO } from '@arch/contracts'

export const settingsIpcInvokers = {
  get: createIpcInvoker<TSettingsServerDTO | null>('SettingsIpc.get'),
  update: createIpcInvokerWithPayload<TSettingsServerDTO | null, TUpdateSettingsServerDTO>(
    'SettingsIpc.update'
  )
} as const

export type TSettingsIpcInvokers = typeof settingsIpcInvokers
