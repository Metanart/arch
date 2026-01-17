import { getMessageFromError } from '@arch/utils'

import { WORKER_MESSAGE_TYPE } from './enums'

import { WorkerMessage, WorkerResponse } from './types'

const defaultResponse: WorkerResponse = {
  type: WORKER_MESSAGE_TYPE.ERROR,
  payload: { message: 'Unknown message type' }
}

self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  const message = event.data
  const response: WorkerResponse = defaultResponse

  try {
    switch (message.type) {
      case WORKER_MESSAGE_TYPE.SCAN: {
        break
      }

      default: {
        self.postMessage({
          type: WORKER_MESSAGE_TYPE.ERROR,
          payload: { message: 'Unknown message type' }
        } satisfies WorkerResponse)
      }
    }
  } catch (error) {
    response.payload = {
      message: getMessageFromError(error)
    }
  }

  self.postMessage(response)
}
