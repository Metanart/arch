import { createLog } from '@arch/utils'
import { TSettingsServerDTO, SettingsServerSchema, TCreateSettingsServerDTO } from '@arch/contracts'

import { AppDataSource } from '@domains/App/AppRoot'

import { SettingsEntity } from '../entities/SettingsEntity'

export async function createSettings(
  newSettings: TCreateSettingsServerDTO
): Promise<TSettingsServerDTO | null> {
  const repo = AppDataSource.getRepository(SettingsEntity)

  const log = createLog({ tag: 'SettingsRepo.createSettings' })

  log.info('Create new settings with payload', newSettings)

  const createdSettings = repo.create(newSettings)

  let savedSettings: SettingsEntity | null

  try {
    savedSettings = await repo.save(createdSettings)
    log.success('New settings saved successfully', savedSettings)
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
