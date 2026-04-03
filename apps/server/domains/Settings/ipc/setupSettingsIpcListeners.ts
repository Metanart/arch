import { TSettingsClientDTO, TUpdateSettingsClientDTO } from '@arch/contracts'
import { SETTINGS_IPC_CHANNELS } from '@arch/enums'

import { addIpcListener, addIpcListenerWithPayload } from '@domains/Shared/ipc'

import { SettingsIpcListeners } from './SettingsIpcListeners'

export function setupSettingsIpcListeners(): void {
  addIpcListener<TSettingsClientDTO>(SettingsIpcListeners.get, SETTINGS_IPC_CHANNELS.GET)

  addIpcListenerWithPayload<TSettingsClientDTO, TUpdateSettingsClientDTO>(
    SettingsIpcListeners.update,
    SETTINGS_IPC_CHANNELS.UPDATE
  )
}
