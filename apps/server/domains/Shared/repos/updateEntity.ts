import { DeepPartial, EntityTarget, FindOptionsWhere } from 'typeorm'

import { AppContext } from '@arch/types'
import { AppError, createLogger } from '@arch/utils'

import { normalizeError } from '@domains/Shared'

import { AppDataSource } from '@domains/App/Root'

import { BaseEntity } from '../entities/BaseEntity'

const messages = {
  start: 'Update requested entity from database',
  updateSuccess: 'Successfully updated requested entity from database',
  updateFailed: 'Failed to update requested entity from database'
}

export async function updateEntity<Entity extends BaseEntity>(
  appContext: AppContext,
  entityTarget: EntityTarget<Entity>,
  entityWhere: FindOptionsWhere<Entity>,
  updatedEntity: DeepPartial<Entity>
): Promise<Entity> {
  const repo = AppDataSource.getRepository<Entity>(entityTarget)
  const logger = createLogger(appContext)

  logger.info(messages.start, updatedEntity)

  let existingEntity: Entity | null
  try {
    existingEntity = await repo.findOne({
      where: entityWhere
    })
  } catch (error) {
    const normalizedError = normalizeError(error, appContext)
    logger.error(messages.updateFailed, normalizedError.message)
    throw normalizedError
  }

  if (!existingEntity) {
    throw new AppError({
      ...appContext,
      message: messages.updateFailed,
      code: 'DB_ENTITY_NOT_FOUND'
    })
  }

  return existingEntity
}
