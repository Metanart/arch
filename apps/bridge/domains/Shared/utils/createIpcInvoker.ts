import { ipcRenderer } from 'electron'

import { IpcChannel, IpcResponse } from '@arch/types'
import { createLogger } from '@arch/utils'

const logger = createLogger({
  domain: 'Global',
  layer: 'IPC',
  origin: 'Bridge invokers expose'
})

export function createIpcInvoker<Data>(channel: IpcChannel): () => Promise<IpcResponse<Data>> {
  return async function invokeIpc() {
    logger.info(`Invoking ${channel}`)
    return ipcRenderer.invoke(channel)
  }
}

export function createIpcInvokerWithPayload<TData, TPayload = void>(
  channel: IpcChannel
): (payload: TPayload) => Promise<IpcResponse<TData>> {
  return async function invokeIpcWithPayload(payload) {
    logger.info(`Invoking ${channel} with payload`, payload)

    if (!payload) {
      return { status: 'error', error: `Invoked ${channel} without payload` }
    } else {
      return ipcRenderer.invoke(channel, payload)
    }
  }
}
