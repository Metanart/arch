import { AppDataSource } from '@domains/App/AppRoot'
import { TUpdateSourceServerDTO, TSourceServerDTO, SourceServerSchema } from '@arch/contracts'
import { createLog } from '@arch/utils'

import { SourceEntity } from '../entities/SourceEntity'

const repo = AppDataSource.getRepository(SourceEntity)

export async function updateSource(
  source: TUpdateSourceServerDTO
): Promise<TSourceServerDTO | null> {
  const log = createLog({ tag: 'SourcesRepo.update' })

  log.info('Updating source with payload', source)

  let existingSource: SourceEntity | null

  try {
    existingSource = await repo.findOne({ where: { id: source.id } })
  } catch (error) {
    log.error('Failed to get and update source by given id', (error as Error).message)
    throw error
  }

  if (existingSource) {
    log.info(`Found existing source - start merge`, existingSource)

    let mergedSource: SourceEntity
    let savedSource: SourceEntity

    try {
      mergedSource = repo.merge(existingSource, { ...source, id: existingSource.id })
      savedSource = await repo.save(mergedSource)
      log.success(`Source updated`, savedSource)
    } catch (error) {
      log.error('Failed to merge and save source:', (error as Error).message)
      throw error
    }

    let mappedDTO: TSourceServerDTO

    try {
      mappedDTO = SourceServerSchema.parse(savedSource)
      log.info('Mapped updated source to DTO', mappedDTO)
    } catch (error) {
      log.error('Failed to map updated source:', (error as Error).message)
      throw error
    }

    return mappedDTO
  }

  log.error(`Source wasn't found - update skipped`)

  return null
}
