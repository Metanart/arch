import { CreateSourceServerDTO, SourceServerDTO, SourceServerSchema } from '@arch/contracts'
import { AppContext } from '@arch/types'
import { createLogger } from '@arch/utils'

import { normalizeError } from '@domains/Shared'

import { AppDataSource } from '@domains/App/Root'

import { SourceEntity } from '../entities/SourceEntity'

const appContext: AppContext = { domain: 'Sources', layer: 'Database', origin: 'createSource' }

const messages = {
  start: 'Create a new source with params',
  saveSuccess: 'New source has been saved',
  saveFailed: 'Failed to create and save source',
  dtoSuccess: 'Mapped source to DTO',
  dtoFailed: 'Failed to map source to DTO'
}

export async function createSource(newSource: CreateSourceServerDTO): Promise<SourceServerDTO> {
  const repo = AppDataSource.getRepository(SourceEntity)
  const logger = createLogger(appContext)

  logger.info(messages.start, newSource)

  let createdSource: SourceEntity
  let savedSource: SourceEntity

  try {
    createdSource = repo.create(newSource)
    savedSource = await repo.save(createdSource)
    logger.success(messages.saveSuccess, savedSource)
  } catch (error) {
    const normalizedError = normalizeError(error, appContext)
    logger.error(messages.saveFailed, normalizedError.message)
    throw normalizedError
  }

  let sourceDTO: SourceServerDTO
  try {
    sourceDTO = SourceServerSchema.parse(savedSource)
    logger.info(messages.dtoSuccess, sourceDTO)
  } catch (error) {
    const normalizedError = normalizeError(error, appContext)
    logger.error(messages.dtoFailed, normalizedError.message)
    throw error
  }

  return sourceDTO
}
