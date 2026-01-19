import { SourceServerDTO } from '@arch/contracts'
import { AppContext, IpcResponse } from '@arch/types'
import { createLogger, getMessageFromError } from '@arch/utils'

import { FileSystemAdapter } from '@domains/Shared'

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

  sourcesDto.forEach(async (sourceDto) => {
    try {
      const scanResult = await FileSystemAdapter.walkDirectoryTree(sourceDto.path)
      logger.info(JSON.stringify(scanResult))
    } catch (error) {
      logger.error(error)
    }
  })

  return { status: 'success', data: sourcesDto }
}
