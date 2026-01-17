import { AppContext } from '@arch/types'
import { createLogger } from '@arch/utils'

import { normalizeError } from '@domains/Shared'

import { AppDataSource } from '@domains/App/Root'

import type { DeepPartial, EntityTarget, ObjectLiteral } from 'typeorm'
import type { z } from 'zod'

const messages = {
  start: 'Create new entity with payload',
  saveSuccess: 'Successfully saved new entity to database',
  saveFailed: 'Failed to save new entity to database',
  dtoSuccess: 'Successfully mapped saved entity to DTO',
  dtoFailed: 'Failed to map saved entity to DTO'
}

export async function createEntity<Entity extends ObjectLiteral, OutputDto>(
  appContext: AppContext,
  entityTarget: EntityTarget<Entity>,
  outputSchema: z.ZodType<OutputDto>,
  inputDto: DeepPartial<Entity>
): Promise<OutputDto> {
  const repo = AppDataSource.getRepository<Entity>(entityTarget)
  const logger = createLogger(appContext)

  logger.info(messages.start, inputDto)

  const newEntity = repo.create(inputDto)

  let savedEntity: Entity
  try {
    savedEntity = await repo.save(newEntity)
    logger.success(messages.saveSuccess, savedEntity)
  } catch (error) {
    const normalizedError = normalizeError(error, appContext)
    logger.error(messages.saveFailed, normalizedError.message)
    throw normalizedError
  }

  try {
    const outputDto = await outputSchema.parseAsync(savedEntity)
    logger.info(messages.dtoSuccess, outputDto)
    return outputDto
  } catch (error) {
    const normalizedError = normalizeError(error, appContext)
    logger.error(messages.dtoFailed, normalizedError.message)
    throw normalizedError
  }
}
