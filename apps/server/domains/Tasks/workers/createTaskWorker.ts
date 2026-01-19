import { resolve } from 'node:path'
import { Worker } from 'node:worker_threads'

import { createLogger } from '@arch/utils'

type TaskWorkerMessage = unknown

const logger = createLogger({ domain: 'Tasks', layer: 'Worker', origin: 'createTaskWorker' })

export type TaskWorkerInstance = {
  worker: Worker
  postMessage: (message: TaskWorkerMessage) => void
  terminate: () => Promise<number>
}

function resolveTaskWorkerEntryPath(): string {
  return resolve(__dirname, 'workers', 'task-worker.js')
}

export function createTaskWorker(): TaskWorkerInstance {
  const workerEntryPath = resolveTaskWorkerEntryPath()

  logger.log('Creating task worker with entry path', workerEntryPath)

  const worker = new Worker(workerEntryPath)

  const postMessage: TaskWorkerInstance['postMessage'] = (message) => {
    worker.postMessage(message)
    logger.log('Posted message to worker', message)
  }

  const terminate: TaskWorkerInstance['terminate'] = async () => {
    const terminated = await worker.terminate()
    logger.log('Worker terminated with code', terminated)
    return terminated
  }

  return { worker, postMessage, terminate }
}
