import { SourceServerDTO, TASK_TYPE } from '@arch/contracts'
import { AppContext, IpcResponse } from '@arch/types'
import { createLogger, getMessageFromError } from '@arch/utils'

import { taskWorkerClient } from '@domains/Tasks'

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

  logger.log('Sources before', sourcesDto)

  for (const sourceDto of sourcesDto) {
    logger.log('Sending request to worker', sourceDto.path)

    try {
      const workerResponse = await taskWorkerClient.sendRequest<typeof TASK_TYPE.SCAN_SOURCE>(
        TASK_TYPE.SCAN_SOURCE,
        {
          dirPath: sourceDto.path
        }
      )

      logger.log('Worker response', workerResponse)
    } catch (error) {
      logger.error(error)
    }
  }

  logger.log('Sources after', sourcesDto)

  return { status: 'success', data: sourcesDto }
}
