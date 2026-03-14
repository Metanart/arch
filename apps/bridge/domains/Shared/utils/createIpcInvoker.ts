import { ipcRenderer } from 'electron'

import { TIpcChannel, IpcResponse } from '@arch/types'
import { createLogger } from '@arch/utils'

const logger = createLogger({
  domain: 'Global',
  layer: 'IPC',
  origin: 'Bridge invokers expose'
})

export function createIpcInvoker<GData>(channel: TIpcChannel): () => Promise<IpcResponse<GData>> {
  return async function invokeIpc() {
    logger.info(`Invoking ${channel}`)
    return ipcRenderer.invoke(channel)
  }
}

export function createIpcInvokerWithPayload<GData, GPayload = void>(
  channel: TIpcChannel
): (payload: GPayload) => Promise<IpcResponse<GData>> {
  return async function invokeIpcWithPayload(payload) {
    logger.info(`Invoking ${channel} with payload`, payload)

    if (!payload) {
      return { status: 'error', error: `Invoked ${channel} without payload` }
    } else {
      return ipcRenderer.invoke(channel, payload)
    }
  }
}
