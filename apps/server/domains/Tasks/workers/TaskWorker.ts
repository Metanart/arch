import { type MessagePort, parentPort } from 'node:worker_threads'

import { TASK_TYPE } from '@arch/contracts'

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

function scanDir(dirPath: string): string {
  if (typeof dirPath !== 'string') {
    throw new TypeError('dirPath must be a string')
  }

  return dirPath
}

MESSAGE_PORT.on('message', (message: TaskWorkerRequest) => {
  let result: TaskWorkerResponse | null = null

  switch (message.type) {
    case TASK_TYPE.MULTIPLY: {
      result = {
        ...message,
        payload: {
          result: multiply(message.payload.value)
        }
      }
      break
    }

    case TASK_TYPE.SCAN_SOURCE: {
      result = {
        ...message,
        payload: {
          dirTree: scanDir(message.payload.dirPath)
        }
      }
      break
    }
  }

  if (result !== null) {
    MESSAGE_PORT.postMessage(result)
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
