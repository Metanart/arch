import {
  SettingsServerSchema,
  TCreateSettingsServerDTO,
  TSettingsServerDTO,
  TUpdateSettingsServerDTO
} from '@arch/contracts'

import { createEntity, findEntity, updateEntity } from '@domains/Shared/repo'

import { SettingsEntity } from '../entities/SettingsEntity'

export async function createSettings(
  settingsDto: TCreateSettingsServerDTO
): Promise<TSettingsServerDTO> {
  return createEntity<SettingsEntity, TSettingsServerDTO>(
    SettingsEntity,
    SettingsServerSchema,
    settingsDto
  )
}

export async function updateSettings(
  settingsDto: TUpdateSettingsServerDTO
): Promise<TSettingsServerDTO> {
  return updateEntity<SettingsEntity, TSettingsServerDTO>(
    SettingsEntity,
    SettingsServerSchema,
    { id: settingsDto.id },
    settingsDto
  )
}

export async function getSettings(): Promise<TSettingsServerDTO> {
  return findEntity<SettingsEntity, TSettingsServerDTO>(SettingsEntity, SettingsServerSchema)
}

export const SettingsRepo = {
  create: createSettings,
  update: updateSettings,
  get: getSettings
}
