import { AppContext } from '@arch/types'
import { createLogger } from '@arch/utils'

import { BaseEntity, normalizeError } from '@domains/Shared'

import { AppDataSource } from '@domains/App/Root'

import type { EntityTarget, FindOptionsWhere } from 'typeorm'
import type { z } from 'zod'

const messages = {
  start: 'Get all entities from database',
  getFailed: 'Failed to get all entities from database',
  getSuccess: 'Successfully got all entities from database',
  entitiesEmpty: 'Table is empty',
  dtoSuccess: 'Successfully mapped entities to DTOs',
  dtoFailed: 'Failed to map entities to DTOs'
}

const appContext: AppContext = { domain: 'Shared', layer: 'Database', origin: 'getAllEntities' }

export async function findEntities<TEntity extends BaseEntity, TOutputDto>(
  entityTarget: EntityTarget<TEntity>,
  outputSchema: z.ZodType<TOutputDto>,
  entityWhere: FindOptionsWhere<TEntity> = {}
): Promise<TOutputDto[]> {
  const repo = AppDataSource.getRepository<TEntity>(entityTarget)
  const logger = createLogger(appContext)

  let entities: TEntity[]

  try {
    entities = await repo.find({ where: entityWhere })
    logger.success(messages.getSuccess, entities)
  } catch (error) {
    const normalizedError = normalizeError(error, appContext)
    logger.error(messages.getFailed, normalizedError.message)
    throw normalizedError
  }

  if (entities.length === 0) {
    logger.info(messages.entitiesEmpty)
    return []
  }

  const validOutputDTOs: TOutputDto[] = []
  let invalidCount = 0

  for (const entity of entities) {
    const result = outputSchema.safeParse(entity)

    if (result.success) {
      validOutputDTOs.push(result.data)
    } else {
      invalidCount += 1

      const issues = result.error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
        code: issue.code
      }))

      logger.error(messages.dtoFailed, {
        id: entity.id ?? '(no id)',
        issues
      })
    }
  }

  logger.info(messages.dtoSuccess, {
    total: entities.length,
    valid: validOutputDTOs.length,
    invalid: invalidCount
  })

  return validOutputDTOs
}
