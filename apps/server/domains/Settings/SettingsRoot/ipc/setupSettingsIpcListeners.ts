import { SettingsServerDTO, UpdateSettingsClientDTO } from '@arch/contracts'
import { SETTINGS_IPC_CHANNELS } from '@arch/enums'

import { addIpcListener, addIpcListenerWithPayload } from '@shared/ipc'
import { SettingsIpcListeners } from './SettingsIpcListeners'

export function setupSettingsIpcListeners(): void {
  addIpcListener<SettingsServerDTO>(SettingsIpcListeners.get, SETTINGS_IPC_CHANNELS.GET)

  addIpcListenerWithPayload<SettingsServerDTO, UpdateSettingsClientDTO>(
    SettingsIpcListeners.update,
    SETTINGS_IPC_CHANNELS.UPDATE
  )
}
