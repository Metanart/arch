import {
  CreateSettingsServerDTO,
  SettingsServerDTO,
  SettingsServerSchema,
  UpdateSettingsServerDTO
} from '@arch/contracts'

import { createEntity, findEntity, updateEntity } from '@domains/Shared'

import { SettingsEntity } from '../entities/SettingsEntity'

export async function createSettings(
  settingsDto: CreateSettingsServerDTO
): Promise<SettingsServerDTO> {
  return createEntity<SettingsEntity, SettingsServerDTO>(
    SettingsEntity,
    SettingsServerSchema,
    settingsDto
  )
}

export async function updateSettings(
  settingsDto: UpdateSettingsServerDTO
): Promise<SettingsServerDTO> {
  return updateEntity<SettingsEntity, SettingsServerDTO>(
    SettingsEntity,
    SettingsServerSchema,
    { id: settingsDto.id },
    settingsDto
  )
}

export async function getSettings(): Promise<SettingsServerDTO> {
  return findEntity<SettingsEntity, SettingsServerDTO>(SettingsEntity, SettingsServerSchema)
}

export const SettingsRepo = {
  create: createSettings,
  update: updateSettings,
  get: getSettings
}
