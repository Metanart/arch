import { SourceServerDTO, SourceServerSchema } from '@arch/contracts'
import { AppContext } from '@arch/types'
import { createLogger } from '@arch/utils'

import { normalizeError } from '@domains/Shared'

import { AppDataSource } from '@domains/App/Root'

import { SourceEntity } from '../entities/SourceEntity'

const appContext: AppContext = { domain: 'Sources', layer: 'Database', origin: 'getAllSources' }

const messages = {
  start: 'Get all sources from database',
  getFailed: 'Failed to get all sources from database',
  getSuccess: 'Successfully got all sources from database',
  sourcesEmpty: 'Sources are empty',
  dtoSuccess: 'Successfully mapped sources to DTOs',
  dtoFailed: 'Failed to map sources to DTOs'
}

export async function getAllSources(): Promise<SourceServerDTO[]> {
  const repo = AppDataSource.getRepository(SourceEntity)
  const logger = createLogger(appContext)

  let sources: SourceEntity[]

  try {
    sources = await repo.find({ order: { createdAt: 'ASC' } })
    logger.success(messages.getSuccess, sources)
  } catch (error) {
    const normalizedError = normalizeError(error, appContext)
    logger.error(messages.getFailed, normalizedError.message)
    throw normalizedError
  }

  if (sources.length === 0) {
    logger.info(messages.sourcesEmpty)
    return []
  }

  const validSourceDTOs: SourceServerDTO[] = []
  let invalidCount = 0

  for (const source of sources) {
    const result = SourceServerSchema.safeParse(source)

    if (result.success) {
      validSourceDTOs.push(result.data)
    } else {
      invalidCount += 1

      const issues = result.error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
        code: issue.code
      }))

      logger.error(messages.dtoFailed, {
        id: source.id ?? '(no id)',
        issues
      })
    }
  }

  logger.info(messages.dtoSuccess, {
    total: sources.length,
    valid: validSourceDTOs.length,
    invalid: invalidCount
  })

  return validSourceDTOs
}
