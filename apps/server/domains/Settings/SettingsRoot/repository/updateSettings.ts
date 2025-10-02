import { IsNull, Not } from 'typeorm'

import { createLog } from '@arch/shared'
import { AppDataSource } from '@server/App/AppRoot'

import { SettingsMapper } from '../mappers/SettingsMapper'
import { SettingsEntity } from '../entities/SettingsEntity'
import {
  SETTINGS_CONTRACTS_KEYS,
  SettingsDTO,
  SettingsUpdateDTO
} from '../contracts/SettingsContracts'

const repo = AppDataSource.getRepository(SettingsEntity)

export async function updateSettings(
  updatedSettings: SettingsUpdateDTO
): Promise<SettingsDTO | null> {
  const log = createLog({ tag: 'SettingsRepo.updateSettings' })

  log.info('Updating settings with payload', updatedSettings)

  let existingSettings: SettingsEntity | null

  try {
    existingSettings = await repo.findOne({
      where: {
        id: Not(IsNull())
      }
    })
  } catch (error) {
    log.error('Failed to fetch existing settings from database:', (error as Error).message)
    throw new Error('Failed to fetch settings from the database')
  }

  let finalSettings: SettingsEntity

  if (existingSettings) {
    log.info('Existing settings found — merging changes')
    finalSettings = repo.merge(existingSettings, { ...existingSettings, ...updatedSettings })
  } else {
    log.warn('Settings not found — creating a new one')
    finalSettings = repo.create(updatedSettings)
  }

  let savedSettings: SettingsEntity
  try {
    savedSettings = await repo.save(finalSettings)
    log.success('Settings saved successfully', savedSettings)
  } catch (error) {
    log.error('Failed to save settings to database:', (error as Error).message)
    throw new Error('Failed to save settings to the database')
  }

  let mappedDTO: SettingsDTO
  try {
    mappedDTO = SettingsMapper.map<SettingsEntity, SettingsDTO>(
      savedSettings,
      SETTINGS_CONTRACTS_KEYS.SettingsEntity,
      SETTINGS_CONTRACTS_KEYS.SettingsDTO
    )
    log.info('Mapped saved settings to DTO', mappedDTO)
  } catch (error) {
    log.error('Failed to map saved settings:', (error as Error).message)
    throw new Error('Failed to map saved config')
  }

  return mappedDTO
}
