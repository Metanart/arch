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

export async function removeEntity<Entity extends BaseEntity>(
  appContext: AppContext,
  entityTarget: EntityTarget<Entity>,
  entityWhere: FindOptionsWhere<Entity>
): Promise<boolean> {
  const repo = AppDataSource.getRepository<Entity>(entityTarget)
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
