import { AppDataSource } from '@domains/App/AppRoot'

import { SourceServerSchema, TCreateSourceServerDTO, TSourceServerDTO } from '@arch/contracts'
import { createLog } from '@arch/utils'

import { SourceEntity } from '../entities/SourceEntity'

const repo = AppDataSource.getRepository(SourceEntity)

export async function createSource(
  source: TCreateSourceServerDTO
): Promise<TSourceServerDTO | null> {
  const log = createLog({ tag: 'SourcesRepository.create' })

  log.info('Create a new source with params', source)

  let created: SourceEntity
  let saved: SourceEntity

  try {
    created = repo.create(source)
    saved = await repo.save(created)
    log.success('New source has been saved', saved)
  } catch (error) {
    log.error('Failed to create and save source:', (error as Error).message)
    throw error
  }

  let mappedDTO: TSourceServerDTO

  try {
    mappedDTO = SourceServerSchema.parse(saved)
    log.info('Mapped source to DTO', mappedDTO)
  } catch (error) {
    log.error('Failed to map source to DTO:', (error as Error).message)
    throw error
  }

  return mappedDTO
}
