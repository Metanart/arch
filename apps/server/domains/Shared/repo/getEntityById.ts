import type { z } from 'zod'

import { TAppContext } from '@arch/types'
import { createLogger } from '@arch/utils'

import { normalizeError } from '@domains/Shared/utils'

import { getDataSource } from '@domains/Shared/database'

import type { EntityTarget, FindOptionsWhere } from 'typeorm'

import { BaseEntity } from '../entities/BaseEntity'

const messages = {
  start: 'Get entity by id from database',
  getFailed: 'Failed to get entity by id from database',
  getSuccess: 'Successfully got entity by id from database',
  notFound: 'Entity not found by id',
  dtoSuccess: 'Successfully mapped entity to DTO',
  dtoFailed: 'Failed to map entity to DTO'
}

const appContext: TAppContext = { domain: 'Shared', layer: 'Database', origin: 'getEntityById' }

export async function getEntityById<GEntity extends BaseEntity, GOutputDto>(
  entityTarget: EntityTarget<GEntity>,
  outputSchema: z.ZodType<GOutputDto>,
  id: string
): Promise<GOutputDto | null> {
  const repo = getDataSource().getRepository<GEntity>(entityTarget)
  const logger = createLogger(appContext)

  logger.info(messages.start, { id })

  let entity: GEntity | null
  try {
    entity = await repo.findOne({ where: { id } as FindOptionsWhere<GEntity> })
  } catch (error) {
    const normalizedError = normalizeError(error, appContext)
    logger.error(messages.getFailed, normalizedError.message)
    throw normalizedError
  }

  if (!entity) {
    logger.info(messages.notFound, { id })
    return null
  }

  try {
    const outputDto = await outputSchema.parseAsync(entity)
    logger.info(messages.dtoSuccess, outputDto)
    return outputDto
  } catch (error) {
    const normalizedError = normalizeError(error, appContext)
    logger.error(messages.dtoFailed, normalizedError.message)
    throw normalizedError
  }
}
