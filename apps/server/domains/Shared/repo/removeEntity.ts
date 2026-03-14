import { DeleteResult, EntityTarget, FindOptionsWhere } from 'typeorm'

import { AppContext } from '@arch/types'
import { createLogger } from '@arch/utils'

import { getDataSource } from '@domains/App'

import { BaseEntity } from '../entities/BaseEntity'
import { normalizeError } from '../utils/normalize-error/normalizeError'

const messages = {
  start: 'Remove requested entity from database',
  removeSuccess: 'Successfully removed requested entity from database',
  removeFailed: 'Failed to remove requested entity from database'
}

const appContext: AppContext = { domain: 'Shared', layer: 'Database', origin: 'removeEntity' }

export async function removeEntity<GEntity extends BaseEntity>(
  entityTarget: EntityTarget<GEntity>,
  entityWhere: FindOptionsWhere<GEntity>
): Promise<boolean> {
  const repo = getDataSource().getRepository<GEntity>(entityTarget)
  const logger = createLogger(appContext)

  logger.info(messages.start)

  let deletedResult: DeleteResult
  try {
    deletedResult = await repo.delete(entityWhere)
  } catch (error) {
    const normalizedError = normalizeError(error, appContext)
    logger.error(messages.removeFailed, normalizedError.message)
    throw normalizedError
  }

  const isDeleted = Boolean(deletedResult.affected && deletedResult.affected > 0)

  if (isDeleted) {
    logger.success(messages.removeSuccess)
  } else {
    logger.error(messages.removeFailed)
  }

  return isDeleted
}
