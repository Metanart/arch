import { type MessagePort, parentPort } from 'node:worker_threads'

import { TASK_TYPE } from '@arch/contracts'

import type { TaskWorkerRequestWithId, TaskWorkerResponse } from './types'

if (parentPort === null) {
  throw new Error('This file must be run as a worker thread')
}

const MESSAGE_PORT: MessagePort = parentPort

function multiply(num: number): number {
  if (typeof num !== 'number') {
    throw new TypeError('num must be a number')
  }

  return num * 2
}

function scanDir(dirPath: string): string {
  if (typeof dirPath !== 'string') {
    throw new TypeError('dirPath must be a string')
  }

  return dirPath
}

MESSAGE_PORT.on('message', async (message: TaskWorkerRequestWithId) => {
  let response: TaskWorkerResponse | null = null

  try {
    switch (message.type) {
      case TASK_TYPE.MULTIPLY: {
        response = {
          ...message,
          payload: {
            result: multiply(message.payload.value)
          }
        }
        break
      }

      case TASK_TYPE.SCAN_SOURCE: {
        const dirTree = await scanDir(message.payload.dirPath)

        response = {
          ...message,
          payload: {
            dirTree: JSON.stringify(dirTree)
          }
        }
        break
      }
    }
  } catch (error) {
    MESSAGE_PORT.postMessage({
      ...message,
      type: 'error',
      payload: { message: error instanceof Error ? error.message : 'Unknown error' }
    })
  }

  if (response !== null) {
    MESSAGE_PORT.postMessage(response)
  } else {
    MESSAGE_PORT.postMessage({
      ...message,
      type: 'error',
      payload: {
        message: 'Unknown task type'
      }
    })
  }
})
