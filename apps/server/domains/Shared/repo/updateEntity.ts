import { DeepPartial, EntityTarget, FindOptionsWhere } from 'typeorm'

import { AppContext } from '@arch/types'
import { AppError, createLogger } from '@arch/utils'

import { normalizeError } from '@domains/Shared'

import { AppDataSource } from '@domains/App/Root'

import { BaseEntity } from '../entities/BaseEntity'

const appContext: AppContext = { domain: 'Shared', layer: 'Database', origin: 'updateEntity' }

const messages = {
  start: 'Update requested entity from database',
  updateSuccess: 'Successfully updated requested entity from database',
  updateFailed: 'Failed to update requested entity from database'
}

export async function updateEntity<TEntity extends BaseEntity>(
  entityTarget: EntityTarget<TEntity>,
  entityWhere: FindOptionsWhere<TEntity>,
  inputDto: DeepPartial<TEntity>
): Promise<TEntity> {
  const repo = AppDataSource.getRepository<TEntity>(entityTarget)
  const logger = createLogger(appContext)

  logger.info(messages.start, inputDto)

  let existingEntity: TEntity | null
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

  const mergedEntity = repo.merge(existingEntity, inputDto)

  let savedEntity: TEntity
  try {
    savedEntity = await repo.save(mergedEntity)
    logger.success(messages.updateSuccess, savedEntity)
  } catch (error) {
    const normalizedError = normalizeError(error, appContext)
    logger.error(messages.updateFailed, normalizedError.message)
    throw normalizedError
  }

  return savedEntity
}
