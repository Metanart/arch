import {
  CreateSourceServerDTO,
  SourceServerDTO,
  SourceServerSchema,
  UpdateSourceServerDTO
} from '@arch/contracts'

import { createEntity, findEntities, removeEntity, updateEntity } from '@domains/Shared'

import { SourceEntity } from '../entities/SourceEntity'

export async function createSource(sourceDto: CreateSourceServerDTO): Promise<SourceServerDTO> {
  return createEntity<SourceEntity, SourceServerDTO>(SourceEntity, SourceServerSchema, sourceDto)
}

export async function removeSource(id: string): Promise<boolean> {
  return removeEntity<SourceEntity>(SourceEntity, { id })
}

export async function updateSource(sourceDto: UpdateSourceServerDTO): Promise<SourceServerDTO> {
  return updateEntity<SourceEntity, SourceServerDTO>(
    SourceEntity,
    SourceServerSchema,
    { id: sourceDto.id },
    sourceDto
  )
}

export async function getAllSources(): Promise<SourceServerDTO[]> {
  return findEntities<SourceEntity, SourceServerDTO>(SourceEntity, SourceServerSchema)
}

export const SourcesRepo = {
  create: createSource,
  remove: removeSource,
  update: updateSource,
  getAll: getAllSources
}
