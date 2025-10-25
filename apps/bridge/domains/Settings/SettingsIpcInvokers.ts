import { createIpcInvoker, createIpcInvokerWithPayload } from '@shared/ipc'
import { TSettingsServerDTO, TSettingsUpdateServerDTO } from '@arch/contracts'

export const settingsIpcInvokers = {
  get: createIpcInvoker<TSettingsServerDTO | null>('SettingsIpc.get'),
  update: createIpcInvokerWithPayload<TSettingsServerDTO | null, TSettingsUpdateServerDTO>(
    'SettingsIpc.update'
  )
} as const

export type TSettingsIpcInvokers = typeof settingsIpcInvokers
