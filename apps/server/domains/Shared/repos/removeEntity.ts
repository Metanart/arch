import { DeleteResult, EntityTarget, FindOptionsWhere } from 'typeorm'

import { AppContext } from '@arch/types'
import { createLogger } from '@arch/utils'

import { normalizeError } from '@domains/Shared'

import { AppDataSource } from '@domains/App/Root'

import { BaseEntity } from '../entities/BaseEntity'

const messages = {
  start: 'Remove requested entity from database',
  removeSuccess: 'Successfully removed requested entity from database',
  removeFailed: 'Failed to remove requested entity from database'
}

const appContext: AppContext = { domain: 'Shared', layer: 'Database', origin: 'removeEntity' }

export async function removeEntity<TEntity extends BaseEntity>(
  entityTarget: EntityTarget<TEntity>,
  entityWhere: FindOptionsWhere<TEntity>
): Promise<boolean> {
  const repo = AppDataSource.getRepository<TEntity>(entityTarget)
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
