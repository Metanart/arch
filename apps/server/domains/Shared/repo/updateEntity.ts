import { DeepPartial, EntityTarget, FindOptionsWhere } from 'typeorm'

import { AppContext } from '@arch/types'
import { AppError, createLogger } from '@arch/utils'

import { normalizeError } from '@domains/Shared'

import { getDataSource } from '@domains/App/Root'

import { z } from 'zod'

import { BaseEntity } from '../entities/BaseEntity'

const appContext: AppContext = { domain: 'Shared', layer: 'Database', origin: 'updateEntity' }

const messages = {
  start: 'Update requested entity from database',
  updateSuccess: 'Successfully updated requested entity from database',
  updateFailed: 'Failed to update requested entity from database',
  dtoSuccess: 'Successfully mapped updated entity to DTO',
  dtoFailed: 'Failed to map updated entity to DTO'
}

export async function updateEntity<TEntity extends BaseEntity, TOutputDto>(
  entityTarget: EntityTarget<TEntity>,
  outputSchema: z.ZodType<TOutputDto>,
  entityWhere: FindOptionsWhere<TEntity>,
  inputDto: DeepPartial<TEntity>
): Promise<TOutputDto> {
  const repo = getDataSource().getRepository<TEntity>(entityTarget)
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

  let outputDto: TOutputDto
  try {
    outputDto = await outputSchema.parseAsync(savedEntity)
    logger.info(messages.dtoSuccess, outputDto)
  } catch (error) {
    const normalizedError = normalizeError(error, appContext)
    logger.error(messages.dtoFailed, normalizedError.message)
    throw normalizedError
  }

  return outputDto
}
