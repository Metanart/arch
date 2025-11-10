import { AppDataSource } from '@domains/App/AppRoot'
import { SourceEntity } from '../entities/SourceEntity'
import { SourceServerSchema, TSourceServerDTO } from '@arch/contracts'
import { createLog } from '@arch/utils'
// import { instanceToPlain } from 'class-transformer' // если нужны plain-объекты

const repo = AppDataSource.getRepository(SourceEntity)

export async function getAllSources(): Promise<TSourceServerDTO[]> {
  const log = createLog({ tag: 'SourcesRepository.getAll' })

  let sources: SourceEntity[]

  try {
    sources = await repo.find({ order: { createdAt: 'ASC' } })
  } catch (error) {
    log.error('Failed to query sources from database:', (error as Error).message)
    throw error
  }

  if (sources.length === 0) {
    log.info('Sources are empty')
    return []
  }

  const valid: TSourceServerDTO[] = []
  let invalidCount = 0

  for (const source of sources) {
    const result = SourceServerSchema.safeParse(source)

    if (result.success) {
      valid.push(result.data)
    } else {
      invalidCount += 1

      const issues = result.error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
        code: issue.code
      }))

      log.error('DTO validation failed', {
        id: source.id ?? '(no id)',
        issues
      })
    }
  }

  log.info('Mapped sources to DTOs', {
    total: sources.length,
    valid: valid.length,
    invalid: invalidCount
  })

  return valid
}
