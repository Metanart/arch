import { handleServiceToIpc } from '@shared/ipc'

import { TSettingsServerDTO, TSettingsUpdateServerDTO } from '@arch/contracts'
import { SettingsRepository } from '../repository/SettingsRepository'

handleServiceToIpc<TSettingsServerDTO | null>('SettingsIpc.get', SettingsRepository.get)

handleServiceToIpc<TSettingsServerDTO | null, TSettingsUpdateServerDTO>(
  'SettingsIpc.update',
  SettingsRepository.update
)
