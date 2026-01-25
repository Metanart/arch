import { type MessagePort, parentPort } from 'node:worker_threads'

import { TASK_TYPE } from '@arch/contracts'

import { FileSystemAdapter } from '@domains/Shared'

import type { TaskWorkerRequest, TaskWorkerResponse } from './types'

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

MESSAGE_PORT.on('message', async (message: TaskWorkerRequest) => {
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
        const dirTree = await FileSystemAdapter.walkDirectoryTree(message.payload.dirPath)

        response = {
          ...message,
          payload: {
            dirTree: dirTree
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
