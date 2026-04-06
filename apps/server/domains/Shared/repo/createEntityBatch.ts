import type { DeepPartial, EntityManager, EntityTarget, ObjectLiteral } from 'typeorm'
import type { z } from 'zod'

import { TAppContext } from '@arch/types'
import { createLogger } from '@arch/utils'

import { getDataSource } from '@/Shared/database'
import { normalizeError } from '@/Shared/utils'

const messages = {
  start: 'Create entity batch with payloads',
  saveSuccess: 'Successfully saved entity batch to database',
  saveFailed: 'Failed to save entity batch to database',
  dtoSuccess: 'Successfully mapped saved entities to DTOs',
  dtoFailed: 'Failed to map saved entities to DTOs'
}

const appContext: TAppContext = { domain: 'Shared', layer: 'Database', origin: 'createEntityBatch' }

export async function createEntityBatch<GEntity extends ObjectLiteral, GOutputDto>(
  entityTarget: EntityTarget<GEntity>,
  outputSchema: z.ZodType<GOutputDto>,
  inputDtos: ReadonlyArray<DeepPartial<GEntity>>,
  entityManager?: EntityManager
): Promise<GOutputDto[]> {
  const logger = createLogger(appContext)

  if (inputDtos.length === 0) {
    return []
  }

  const repo = entityManager
    ? entityManager.getRepository<GEntity>(entityTarget)
    : getDataSource().getRepository<GEntity>(entityTarget)

  logger.info(messages.start, { count: inputDtos.length })

  const newEntities = repo.create(inputDtos as DeepPartial<GEntity>[])

  let savedEntities: GEntity[]
  try {
    savedEntities = await repo.save(newEntities)
    logger.success(messages.saveSuccess, { count: savedEntities.length })
  } catch (error) {
    const normalizedError = normalizeError(error, appContext)
    logger.error(messages.saveFailed, normalizedError.message)
    throw normalizedError
  }

  const outputDtos: GOutputDto[] = []
  for (const entity of savedEntities) {
    try {
      const dto = await outputSchema.parseAsync(entity)
      outputDtos.push(dto)
    } catch (error) {
      const normalizedError = normalizeError(error, appContext)
      logger.error(messages.dtoFailed, normalizedError.message)
      throw normalizedError
    }
  }

  logger.info(messages.dtoSuccess, { count: outputDtos.length })
  return outputDtos
}
