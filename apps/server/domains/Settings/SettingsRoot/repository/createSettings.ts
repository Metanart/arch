import { createLogger } from '@arch/utils'
import { AppContext } from '@arch/types'
import { SettingsServerDTO, SettingsServerSchema, CreateSettingsServerDTO } from '@arch/contracts'

import { AppDataSource } from '@domains/App/AppRoot'
import { normalizeError } from '@shared/utils'

import { SettingsEntity } from '../entities/SettingsEntity'

const appContext: AppContext = { domain: 'Settings', layer: 'Database', origin: 'createSettings' }

const messages = {
  start: 'Create new settings with payload',
  saveSuccess: 'Successfully saved new settings to database',
  saveFailed: 'Failed to save new settings to database',
  dtoSuccess: 'Successfully mapped saved settings to DTO',
  dtoFailed: 'Failed to map saved settings to DTO'
}

export async function createSettings(
  newSettings: CreateSettingsServerDTO
): Promise<SettingsServerDTO | null> {
  const repo = AppDataSource.getRepository(SettingsEntity)
  const logger = createLogger(appContext)
  const settings = repo.create(newSettings)

  logger.info(messages.start, newSettings)

  let savedSettings: SettingsEntity | null
  try {
    savedSettings = await repo.save(settings)
    logger.success(messages.saveSuccess, savedSettings)
  } catch (error) {
    const normalizedError = normalizeError(error, appContext)
    logger.error(messages.saveFailed, normalizedError.message)
    throw normalizedError
  }

  let settingsDTO: SettingsServerDTO
  try {
    settingsDTO = await SettingsServerSchema.parseAsync(savedSettings)
    logger.info(messages.dtoSuccess, settingsDTO)
  } catch (error) {
    const normalizedError = normalizeError(error, appContext)
    logger.error(messages.dtoFailed, normalizedError.message)
    throw normalizedError
  }

  return settingsDTO
}
