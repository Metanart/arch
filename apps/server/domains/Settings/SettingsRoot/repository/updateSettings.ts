import { IsNull, Not } from 'typeorm'

import { createLog } from '@arch/utils'
import { TSettingsServerDTO, TSettingsUpdateServerDTO, SettingsServerSchema } from '@arch/contracts'

import { AppDataSource } from '@domains/App/AppRoot'

import { SettingsEntity } from '../entities/SettingsEntity'

export async function updateSettings(
  updatedSettings: TSettingsUpdateServerDTO
): Promise<TSettingsServerDTO | null> {
  const repo = AppDataSource.getRepository(SettingsEntity)

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

  let savedSettings: SettingsEntity | null
  try {
    savedSettings = await repo.save(finalSettings)
    log.success('Settings saved successfully', savedSettings)
  } catch (error) {
    log.error('Failed to save settings to database:', (error as Error).message)
    throw new Error('Failed to save settings to the database')
  }

  let serverDTO: TSettingsServerDTO
  try {
    serverDTO = await SettingsServerSchema.parseAsync(savedSettings)
    log.info('Mapped saved settings to DTO', serverDTO)
  } catch (error) {
    log.error('Failed to map saved settings:', (error as Error).message)
    throw new Error('Failed to map saved config')
  }

  return serverDTO
}
