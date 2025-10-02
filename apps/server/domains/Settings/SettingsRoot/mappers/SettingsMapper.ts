import { createMap, createMapper } from '@automapper/core'
import { pojos } from '@automapper/pojos'

import { SETTINGS_CONTRACTS_KEYS, SettingsDTO } from '../contracts/SettingsContracts'

import { SettingsEntity } from '../entities/SettingsEntity'

import '../mappers/SettingsMapper.metadata'

export const SettingsMapper = createMapper({
  strategyInitializer: pojos()
})

createMap<SettingsEntity, SettingsDTO>(
  SettingsMapper,
  SETTINGS_CONTRACTS_KEYS.SettingsEntity,
  SETTINGS_CONTRACTS_KEYS.SettingsDTO
)
