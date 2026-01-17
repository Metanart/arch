import { CreateSourceClientDTO, SourceServerDTO, UpdateSourceClientDTO } from '@arch/contracts'
import { IpcResponse } from '@arch/types'
import { getMessageFromError } from '@arch/utils'

import { getAllSources } from './getAllSources'

import { SourcesRepository } from '../repository/SourcesRepository'

async function create(source: CreateSourceClientDTO): Promise<IpcResponse<SourceServerDTO>> {
  try {
    const sourceDto = await SourcesRepository.create(source)
    return { status: 'success', data: sourceDto }
  } catch (error: unknown) {
    return { status: 'error', error: { message: getMessageFromError(error) } }
  }
}

async function update(source: UpdateSourceClientDTO): Promise<IpcResponse<SourceServerDTO>> {
  if (!source) {
    return { status: 'error', error: { message: 'Source is required' } }
  }

  try {
    const sourceDto = await SourcesRepository.update(source)
    return { status: 'success', data: sourceDto }
  } catch (error: unknown) {
    return { status: 'error', error: { message: getMessageFromError(error) } }
  }
}

async function remove(sourceId: string): Promise<IpcResponse<boolean>> {
  try {
    const result = await SourcesRepository.remove(sourceId)
    return { status: 'success', data: result }
  } catch (error: unknown) {
    return { status: 'error', error: { message: getMessageFromError(error) } }
  }
}

export const SourcesIpcListeners = {
  getAll: getAllSources,
  create,
  update,
  remove
}
