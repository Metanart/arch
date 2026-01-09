import { IsNull, Not } from 'typeorm'

import { SettingsServerDTO, SettingsServerSchema, UpdateSettingsServerDTO } from '@arch/contracts'
import { AppContext } from '@arch/types'
import { AppError, createLogger } from '@arch/utils'

import { normalizeError } from '@domains/Shared'

import { AppDataSource } from '@domains/App/Root'

import { SettingsEntity } from '../entities/SettingsEntity'

const appContext: AppContext = { domain: 'Settings', layer: 'Database', origin: 'updateSettings' }

const messages = {
  start: 'Update settings with payload',
  existingSettingsFound: 'Existing settings found — merging changes',
  settingsNotFound: 'Settings not found — creating a new one',
  updateFailed: 'Failed to update settings with payload',
  updateSuccess: 'Successfully updated settings with payload',
  dtoSuccess: 'Successfully mapped updated settings to DTO',
  dtoFailed: 'Failed to map updated settings to DTO'
}

export async function updateSettings(
  updatedSettings: UpdateSettingsServerDTO
): Promise<SettingsServerDTO> {
  const repo = AppDataSource.getRepository(SettingsEntity)
  const logger = createLogger(appContext)

  logger.info(messages.start, updatedSettings)

  let existingSettings: SettingsEntity | null
  try {
    existingSettings = await repo.findOne({
      where: {
        id: Not(IsNull())
      }
    })
  } catch (error) {
    const normalizedError = normalizeError(error, appContext)
    logger.error(messages.updateFailed, normalizedError.message)
    throw normalizedError
  }

  if (!existingSettings) {
    logger.warn(messages.settingsNotFound)
    throw new AppError({
      ...appContext,
      message: messages.settingsNotFound,
      code: 'DB_ENTITY_NOT_FOUND'
    })
  }

  logger.info(messages.existingSettingsFound, existingSettings)
  const mergedSettings = repo.merge(existingSettings, updatedSettings)

  let savedSettings: SettingsEntity
  try {
    savedSettings = await repo.save(mergedSettings)
    logger.success(messages.updateSuccess, savedSettings)
  } catch (error) {
    const normalizedError = normalizeError(error, appContext)
    logger.error(messages.updateFailed, normalizedError.message)
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
