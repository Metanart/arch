import { SourceServerDTO } from '@arch/contracts'
import { AppContext, IpcResponse } from '@arch/types'
import { createLogger, getMessageFromError } from '@arch/utils'

import { SourcesRepo } from '../repo/SourcesRepo'

const appContext: AppContext = { domain: 'Sources', layer: 'IPC', origin: 'getAllSources' }

const logger = createLogger(appContext)

export async function getAllSources(): Promise<IpcResponse<SourceServerDTO[]>> {
  let sourcesDto: SourceServerDTO[] = []

  try {
    sourcesDto = await SourcesRepo.getAll()
  } catch (error: unknown) {
    return { status: 'error', error: { message: getMessageFromError(error) } }
  }

  logger.log('Sources', sourcesDto)

  return { status: 'success', data: sourcesDto }
}
