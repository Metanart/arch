import { CreateSourceClientDTO, SourceServerDTO, UpdateSourceClientDTO } from '@arch/contracts'
import { IpcResponse } from '@arch/types'
import { getMessageFromError } from '@arch/utils'

import { getAllSources } from './getAllSources'

import { SourcesRepo } from '../repository/SourcesRepo'

async function create(source: CreateSourceClientDTO): Promise<IpcResponse<SourceServerDTO>> {
  try {
    const sourceDto = await SourcesRepo.create(source)
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
    const sourceDto = await SourcesRepo.update(source)
    return { status: 'success', data: sourceDto }
  } catch (error: unknown) {
    return { status: 'error', error: { message: getMessageFromError(error) } }
  }
}

async function remove(sourceId: string): Promise<IpcResponse<boolean>> {
  try {
    const result = await SourcesRepo.remove(sourceId)
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
