import { DeleteResult } from 'typeorm'

import { AppContext } from '@arch/types'
import { createLogger } from '@arch/utils'

import { normalizeError } from '@domains/Shared'

import { AppDataSource } from '@domains/App/Root'

import { SourceEntity } from '../entities/SourceEntity'

const appContext: AppContext = { domain: 'Sources', layer: 'Database', origin: 'removeSource' }

const messages = {
  start: 'Remove source with id',
  removeSuccess: 'Successfully removed source with id',
  removeFailed: 'Failed to remove source with id'
}

export async function removeSource(sourceId: string): Promise<boolean> {
  const repo = AppDataSource.getRepository(SourceEntity)
  const logger = createLogger(appContext)

  logger.info(messages.start, sourceId)

  let deletedResult: DeleteResult
  try {
    deletedResult = await repo.delete({ id: sourceId })
  } catch (error) {
    const normalizedError = normalizeError(error, appContext)
    logger.error(messages.removeFailed, normalizedError.message)
    throw normalizedError
  }

  const isDeleted = Boolean(deletedResult.affected && deletedResult.affected > 0)

  if (isDeleted) {
    logger.success(messages.removeSuccess, sourceId)
  } else {
    logger.error(messages.removeFailed, sourceId)
  }

  return isDeleted
}
