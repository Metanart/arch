import {
  SourceServerSchema,
  TCreateSourceServerDTO,
  TSourceServerDTO,
  TUpdateSourceServerDTO
} from '@arch/contracts'

import { createEntity, findEntities, removeEntity, updateEntity } from '@domains/Shared'

import { SourceEntity } from '../entities/SourceEntity'

export async function createSource(sourceDto: TCreateSourceServerDTO): Promise<TSourceServerDTO> {
  return createEntity<SourceEntity, TSourceServerDTO>(SourceEntity, SourceServerSchema, sourceDto)
}

export async function removeSource(id: string): Promise<boolean> {
  return removeEntity<SourceEntity>(SourceEntity, { id })
}

export async function updateSource(sourceDto: TUpdateSourceServerDTO): Promise<TSourceServerDTO> {
  return updateEntity<SourceEntity, TSourceServerDTO>(
    SourceEntity,
    SourceServerSchema,
    { id: sourceDto.id },
    sourceDto
  )
}

export async function getAllSources(): Promise<TSourceServerDTO[]> {
  return findEntities<SourceEntity, TSourceServerDTO>(SourceEntity, SourceServerSchema)
}

export const SourcesRepo = {
  create: createSource,
  remove: removeSource,
  update: updateSource,
  getAll: getAllSources
}
