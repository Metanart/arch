import { EntityTarget, FindOptionsWhere } from 'typeorm'

import { z } from 'zod'

import { TAppContext } from '@arch/types'
import { AppError, createLogger } from '@arch/utils'

import { normalizeError } from '@domains/Shared/utils'

import { getDataSource } from '@domains/Shared/database'

import { BaseEntity } from '../entities/BaseEntity'

const messages = {
  start: 'Get requested entity from database',
  getFailed: 'Failed to get requested entity from database',
  getSuccess: 'Successfully got requested entity from database',
  dtoSuccess: 'Successfully mapped requested entity to DTO',
  dtoFailed: 'Failed to map requested entity to DTO'
}

const appContext: TAppContext = { domain: 'Shared', layer: 'Database', origin: 'getEntity' }

export async function findEntity<GEntity extends BaseEntity, GOutputDto>(
  entityTarget: EntityTarget<GEntity>,
  outputSchema: z.ZodType<GOutputDto>,
  entityWhere: FindOptionsWhere<GEntity> = {}
): Promise<GOutputDto> {
  const repo = getDataSource().getRepository<GEntity>(entityTarget)
  const logger = createLogger(appContext)

  logger.info(messages.start, entityWhere)
  let entity: GEntity | null
  try {
    entity = await repo.findOne({ where: entityWhere })
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

  let outputDto: GOutputDto
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
