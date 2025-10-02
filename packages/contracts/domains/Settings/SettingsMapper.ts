import { createMap, createMapper } from '@automapper/core'
import { pojos } from '@automapper/pojos'

import {
  TSettingsClientDTO,
  TSettingsServerDTO,
  TSettingsUpdateClientDTO,
  TSettingsUpdateServerDTO
} from './Settings.contracts'

import { ESettingsMapperKeys } from './enums'

export const SettingsMapper = createMapper({
  strategyInitializer: pojos()
})

createMap<TSettingsServerDTO, TSettingsClientDTO>(
  SettingsMapper,
  ESettingsMapperKeys.SettingsServerDTO,
  ESettingsMapperKeys.SettingsClientDTO
)

createMap<TSettingsClientDTO, TSettingsServerDTO>(
  SettingsMapper,
  ESettingsMapperKeys.SettingsClientDTO,
  ESettingsMapperKeys.SettingsServerDTO
)

createMap<TSettingsUpdateServerDTO, TSettingsUpdateClientDTO>(
  SettingsMapper,
  ESettingsMapperKeys.SettingsUpdateServerDTO,
  ESettingsMapperKeys.SettingsUpdateClientDTO
)

createMap<TSettingsUpdateClientDTO, TSettingsUpdateServerDTO>(
  SettingsMapper,
  ESettingsMapperKeys.SettingsUpdateClientDTO,
  ESettingsMapperKeys.SettingsUpdateServerDTO
)
