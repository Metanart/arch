import { PojosMetadataMap } from '@automapper/pojos'

import { convertZodToPojo } from '../../utils/convertZodToPojo'

import {
  TSettingsClientDTO,
  TSettingsServerDTO,
  TSettingsUpdateClientDTO,
  TSettingsUpdateServerDTO
} from './Settings.contracts'
import {
  SettingsClientSchema,
  SettingsUpdateClientSchema,
  SettingsServerSchema,
  SettingsUpdateServerSchema
} from './Settings.schemes'

import { ESettingsMapperKeys } from './enums'

PojosMetadataMap.create<TSettingsClientDTO>(
  ESettingsMapperKeys.SettingsClientDTO,
  convertZodToPojo(SettingsClientSchema)
)

PojosMetadataMap.create<TSettingsServerDTO>(
  ESettingsMapperKeys.SettingsServerDTO,
  convertZodToPojo(SettingsServerSchema)
)

PojosMetadataMap.create<TSettingsUpdateClientDTO>(
  ESettingsMapperKeys.SettingsUpdateClientDTO,
  convertZodToPojo(SettingsUpdateClientSchema)
)
PojosMetadataMap.create<TSettingsUpdateServerDTO>(
  ESettingsMapperKeys.SettingsUpdateServerDTO,
  convertZodToPojo(SettingsUpdateServerSchema)
)
