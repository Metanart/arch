import { SourceServerDTO, TASK_TYPE } from '@arch/contracts'
import { AppContext, IpcResponse } from '@arch/types'
import { createLogger, getMessageFromError } from '@arch/utils'

import { FileSystemAdapter } from '@domains/Shared'

import { createTaskWorker } from '@domains/Tasks'

import { SourcesRepo } from '../repo/SourcesRepo'

const appContext: AppContext = { domain: 'Sources', layer: 'IPC', origin: 'getAllSources' }

const logger = createLogger(appContext)

import type { Worker } from 'node:worker_threads'

import type { TaskWorkerResponse } from '@domains/Tasks'

function sendAndWaitForOneMessage<TResponse>(worker: Worker, payload: unknown): Promise<TResponse> {
  return new Promise((resolve, reject) => {
    const handleMessage = (message: unknown) => {
      cleanup()
      resolve(message as TResponse)
    }

    const handleError = (error: Error) => {
      cleanup()
      reject(error)
    }

    const cleanup = () => {
      worker.off('message', handleMessage)
      worker.off('error', handleError)
    }

    worker.once('message', handleMessage)
    worker.once('error', handleError)

    worker.postMessage(payload)
  })
}

export async function getAllSources(): Promise<IpcResponse<SourceServerDTO[]>> {
  let sourcesDto: SourceServerDTO[] = []

  const taskWorker = createTaskWorker()

  try {
    sourcesDto = await SourcesRepo.getAll()
  } catch (error: unknown) {
    return { status: 'error', error: { message: getMessageFromError(error) } }
  }

  logger.log('Sources before', sourcesDto)

  for (const sourceDto of sourcesDto) {
    try {
      const scanResult = await FileSystemAdapter.walkDirectoryTree(sourceDto.path)
      logger.info(JSON.stringify(scanResult))

      try {
        const workerResponse = await sendAndWaitForOneMessage<TaskWorkerResponse>(
          taskWorker.worker,
          {
            type: TASK_TYPE.MULTIPLY,
            payload: { value: 10 }
          }
        )

        logger.log('Worker response', workerResponse)

        const workerResponse2 = await sendAndWaitForOneMessage<TaskWorkerResponse>(
          taskWorker.worker,
          {
            type: TASK_TYPE.SCAN_SOURCE,
            payload: { dirPath: '/path/to/dir' }
          }
        )

        logger.log('Worker response 2', workerResponse2)
      } finally {
        const exitCode = await taskWorker.terminate()
        logger.log('Worker terminated with code', exitCode)
      }
    } catch (error) {
      logger.error(error)
    }
  }

  logger.log('Sources after', sourcesDto)

  return { status: 'success', data: sourcesDto }
}
