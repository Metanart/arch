import { DeepPartial, EntityTarget, FindOptionsWhere } from 'typeorm'

import { z } from 'zod'

import { TAppContext } from '@arch/types'
import { AppError, createLogger } from '@arch/utils'

import { normalizeError } from '@domains/Shared/utils'

import { getDataSource } from '@domains/App/database'

import { BaseEntity } from '../entities/BaseEntity'

const appContext: TAppContext = { domain: 'Shared', layer: 'Database', origin: 'updateEntity' }

const messages = {
  start: 'Update requested entity from database',
  updateSuccess: 'Successfully updated requested entity from database',
  updateFailed: 'Failed to update requested entity from database',
  dtoSuccess: 'Successfully mapped updated entity to DTO',
  dtoFailed: 'Failed to map updated entity to DTO'
}

export async function updateEntity<GEntity extends BaseEntity, GOutputDto>(
  entityTarget: EntityTarget<GEntity>,
  outputSchema: z.ZodType<GOutputDto>,
  entityWhere: FindOptionsWhere<GEntity>,
  inputDto: DeepPartial<GEntity>
): Promise<GOutputDto> {
  const repo = getDataSource().getRepository<GEntity>(entityTarget)
  const logger = createLogger(appContext)

  logger.info(messages.start, inputDto)

  let existingEntity: GEntity | null
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

  let savedEntity: GEntity
  try {
    savedEntity = await repo.save(mergedEntity)
    logger.success(messages.updateSuccess, savedEntity)
  } catch (error) {
    const normalizedError = normalizeError(error, appContext)
    logger.error(messages.updateFailed, normalizedError.message)
    throw normalizedError
  }

  let outputDto: GOutputDto
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
