import { AppDataSource } from '@domains/App/AppRoot'

import { createLog } from '@arch/utils'

import { SourceEntity } from '../entities/SourceEntity'

const repo = AppDataSource.getRepository(SourceEntity)

export async function removeSource(sourceId: string): Promise<boolean> {
  const log = createLog({ tag: 'SourcesRepository.remove' })

  log.info('Removing source with id', sourceId)

  let deleted: { affected?: number | null }

  try {
    deleted = await repo.delete({ id: sourceId })
  } catch (error) {
    log.error('Failed to delete source from database:', (error as Error).message)
    throw error
  }

  if (deleted.affected && deleted.affected > 0) {
    log.info(`Deleted source by id ${sourceId}`)
    return true
  }

  log.error(`Source by id "${sourceId}" is not deleted`)

  return false
}
