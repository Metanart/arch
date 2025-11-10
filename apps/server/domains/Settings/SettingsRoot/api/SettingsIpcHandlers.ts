import { handleServiceToIpc } from '@shared/ipc'

import { TSettingsServerDTO, TUpdateSettingsServerDTO } from '@arch/contracts'
import { SettingsRepository } from '../repository/SettingsRepository'

export function setupSettingsIpcHandlers(): void {
  handleServiceToIpc<TSettingsServerDTO | null>('SettingsIpc.get', SettingsRepository.get)

  handleServiceToIpc<TSettingsServerDTO | null, TUpdateSettingsServerDTO>(
    'SettingsIpc.update',
    SettingsRepository.update
  )
}
