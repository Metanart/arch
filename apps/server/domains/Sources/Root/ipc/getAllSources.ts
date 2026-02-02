import { SourceServerDTO } from '@arch/contracts'
import { IpcResponse } from '@arch/types'
import { getMessageFromError } from '@arch/utils'

import { SourcesRepo } from '../repo/SourcesRepo'
import { SourcesService } from '../services/SourcesService'

export async function getAllSources(): Promise<IpcResponse<SourceServerDTO[]>> {
  let sourcesDto: SourceServerDTO[] = []

  try {
    sourcesDto = await SourcesRepo.getAll()
  } catch (error: unknown) {
    return { status: 'error', error: { message: getMessageFromError(error) } }
  }

  for (const sourceDto of sourcesDto) {
    SourcesService.scanSource(sourceDto.path)
  }

  return { status: 'success', data: sourcesDto }
}
