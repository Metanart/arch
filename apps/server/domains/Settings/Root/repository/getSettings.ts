import { IsNull, Not } from 'typeorm'

import { SettingsServerDTO, SettingsServerSchema } from '@arch/contracts'
import { AppContext } from '@arch/types'
import { createLogger } from '@arch/utils'

import { normalizeError } from '@domains/Shared'

import { AppDataSource } from '@domains/App/Root'

import { createSettings } from './createSettings'

import { SettingsEntity } from '../entities/SettingsEntity'

const appContext: AppContext = { domain: 'Settings', layer: 'Database', origin: 'getSettings' }

const messages = {
  start: 'Get requested settings from database',
  getFailed: 'Failed to get requested settings from database',
  getSuccess: 'Successfully got requested settings from database',
  dtoSuccess: 'Successfully mapped requested settings to DTO',
  dtoFailed: 'Failed to map requested settings to DTO',
  settingsNotFound: 'Settings not found in database — creating a new one'
}

export async function getSettings(): Promise<SettingsServerDTO> {
  const repo = AppDataSource.getRepository(SettingsEntity)
  const logger = createLogger(appContext)

  logger.info(messages.start)

  let settings: SettingsEntity | null
  try {
    settings = await repo.findOne({
      where: {
        id: Not(IsNull())
      }
    })
  } catch (error) {
    const normalizedError = normalizeError(error, appContext)
    logger.error(messages.getFailed, normalizedError.message)
    throw normalizedError
  }

  if (!settings) {
    logger.warn(messages.settingsNotFound)

    try {
      settings = await createSettings({})
      logger.success(messages.getSuccess, settings)
    } catch (error) {
      const normalizedError = normalizeError(error, appContext)
      logger.error(messages.getFailed, normalizedError.message)
      throw normalizedError
    }
  }

  let settingsDTO: SettingsServerDTO
  try {
    settingsDTO = await SettingsServerSchema.parseAsync(settings)
    logger.info(messages.dtoSuccess, settingsDTO)
  } catch (error) {
    const normalizedError = normalizeError(error, appContext)
    logger.error(messages.dtoFailed, normalizedError.message)
    throw normalizedError
  }

  return settingsDTO
}
