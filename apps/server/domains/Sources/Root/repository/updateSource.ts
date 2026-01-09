import { SourceServerDTO, SourceServerSchema, UpdateSourceServerDTO } from '@arch/contracts'
import { AppContext } from '@arch/types'
import { AppError, createLogger } from '@arch/utils'

import { normalizeError } from '@domains/Shared'

import { AppDataSource } from '@domains/App/Root'

import { SourceEntity } from '../entities/SourceEntity'

const appContext: AppContext = { domain: 'Sources', layer: 'Database', origin: 'updateSource' }

const messages = {
  start: 'Update source with payload',
  updateFailed: 'Failed to update source with payload',
  updateSuccess: 'Successfully updated source with payload',
  dtoSuccess: 'Successfully mapped updated source to DTO',
  dtoFailed: 'Failed to map updated source to DTO',
  existingSourceFound: 'Existing source found — start merge',
  sourceNotFound: 'Source not found — create a new one'
}

export async function updateSource(
  updatingSource: UpdateSourceServerDTO
): Promise<SourceServerDTO> {
  const repo = AppDataSource.getRepository(SourceEntity)
  const logger = createLogger(appContext)

  logger.info(messages.start, updatingSource)

  let existingSource: SourceEntity | null
  try {
    existingSource = await repo.findOne({ where: { id: updatingSource.id } })
    logger.success(messages.updateSuccess, existingSource)
  } catch (error) {
    const normalizedError = normalizeError(error, appContext)
    logger.error(messages.updateFailed, normalizedError.message)
    throw normalizedError
  }

  if (!existingSource) {
    logger.warn(messages.sourceNotFound)
    throw new AppError({
      ...appContext,
      message: messages.sourceNotFound,
      code: 'DB_ENTITY_NOT_FOUND'
    })
  }

  logger.info(messages.existingSourceFound, existingSource)

  let mergedSource: SourceEntity
  let savedSource: SourceEntity
  try {
    mergedSource = repo.merge(existingSource, updatingSource)
    savedSource = await repo.save(mergedSource)
    logger.success(messages.updateSuccess, savedSource)
  } catch (error) {
    const normalizedError = normalizeError(error, appContext)
    logger.error(messages.updateFailed, normalizedError.message)
    throw normalizedError
  }

  let sourceDTO: SourceServerDTO
  try {
    sourceDTO = await SourceServerSchema.parseAsync(savedSource)
    logger.info(messages.dtoSuccess, sourceDTO)
  } catch (error) {
    const normalizedError = normalizeError(error, appContext)
    logger.error(messages.dtoFailed, normalizedError.message)
    throw normalizedError
  }

  return sourceDTO
}
