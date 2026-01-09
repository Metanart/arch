import { SettingsClientDTO, UpdateSettingsClientDTO } from '@arch/contracts'
import { SETTINGS_IPC_CHANNELS } from '@arch/enums'

import { addIpcListener, addIpcListenerWithPayload } from '@domains/Shared'

import { SettingsIpcListeners } from './SettingsIpcListeners'

export function setupSettingsIpcListeners(): void {
  addIpcListener<SettingsClientDTO>(SettingsIpcListeners.get, SETTINGS_IPC_CHANNELS.GET)

  addIpcListenerWithPayload<SettingsClientDTO, UpdateSettingsClientDTO>(
    SettingsIpcListeners.update,
    SETTINGS_IPC_CHANNELS.UPDATE
  )
}
