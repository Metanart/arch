import { IsNull, Not } from 'typeorm'

import { AppContext } from '@arch/types'
import { SettingsServerDTO, UpdateSettingsServerDTO, SettingsServerSchema } from '@arch/contracts'

import { AppDataSource } from '@domains/App/AppRoot'

import { SettingsEntity } from '../entities/SettingsEntity'
import { AppError, createLogger } from '@arch/utils'
import { normalizeError } from '@shared/utils'

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
  updatedSettings: UpdateSettingsServerDTO | null
): Promise<SettingsServerDTO> {
  if (!updatedSettings)
    throw new AppError({
      ...appContext,
      message: 'No data provided to update settings',
      code: 'EMPTY_ARGUMENTS'
    })

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

  let mergedSettings: SettingsEntity

  if (existingSettings) {
    logger.info(messages.existingSettingsFound, existingSettings)
    mergedSettings = repo.merge(existingSettings, updatedSettings)
  } else {
    logger.warn(messages.settingsNotFound)
    mergedSettings = repo.create(updatedSettings)
  }

  let savedMergedSettings: SettingsEntity | null
  try {
    savedMergedSettings = await repo.save(mergedSettings)
    logger.success(messages.updateSuccess, savedMergedSettings)
  } catch (error) {
    const normalizedError = normalizeError(error, appContext)
    logger.error(messages.updateFailed, normalizedError.message)
    throw normalizedError
  }

  let settingsDTO: SettingsServerDTO
  try {
    settingsDTO = await SettingsServerSchema.parseAsync(savedMergedSettings)
    logger.info(messages.dtoSuccess, settingsDTO)
  } catch (error) {
    const normalizedError = normalizeError(error, appContext)
    logger.error(messages.dtoFailed, normalizedError.message)
    throw normalizedError
  }

  return settingsDTO
}
