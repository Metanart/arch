import { TASK_TYPE } from '@arch/contracts'
import { AppContext } from '@arch/types'
import { createLogger } from '@arch/utils'

import { taskWorkerClient } from '@domains/Tasks'

const appContext: AppContext = { domain: 'Sources', layer: 'Service', origin: 'scanSource' }

const logger = createLogger(appContext)

export async function scanSource(sourcePath: string): Promise<void> {
  logger.log('Scan sources', sourcePath)

  try {
    const workerResponse = await taskWorkerClient.sendRequest<typeof TASK_TYPE.SCAN_SOURCE>(
      TASK_TYPE.SCAN_SOURCE,
      {
        dirPath: sourcePath
      }
    )

    logger.log('Worker response', JSON.stringify(workerResponse))
  } catch (error) {
    logger.error(error)
  }
}
