import { EntityTarget } from 'typeorm'

import { AppContext } from '@arch/types'
import { AppError, createLogger } from '@arch/utils'

import { BaseEntity, normalizeError } from '@domains/Shared'

import { AppDataSource } from '@domains/App/Root'

import type { z } from 'zod'

const messages = {
  start: 'Get requested entity from database',
  getFailed: 'Failed to get requested entity from database',
  getSuccess: 'Successfully got requested entity from database',
  dtoSuccess: 'Successfully mapped requested entity to DTO',
  dtoFailed: 'Failed to map requested entity to DTO'
}

export async function getFirstEntity<TEntity extends BaseEntity, TOutputDto>(
  appContext: AppContext,
  entityTarget: EntityTarget<TEntity>,
  outputSchema: z.ZodType<TOutputDto>
): Promise<TOutputDto> {
  const repo = AppDataSource.getRepository<TEntity>(entityTarget)
  const logger = createLogger(appContext)

  logger.info(messages.start)
  let entity: TEntity | null
  try {
    entity = await repo.findOne({})
  } catch (error) {
    const normalizedError = normalizeError(error, appContext)
    logger.error(messages.getFailed, normalizedError.message)
    throw normalizedError
  }

  if (!entity) {
    throw new AppError({
      ...appContext,
      message: messages.getFailed,
      code: 'DB_ENTITY_NOT_FOUND'
    })
  }

  let outputDto: TOutputDto
  try {
    outputDto = await outputSchema.parseAsync(entity)
    logger.info(messages.dtoSuccess, outputDto)
  } catch (error) {
    const normalizedError = normalizeError(error, appContext)
    logger.error(messages.dtoFailed, normalizedError.message)
    throw normalizedError
  }

  return outputDto
}
