import { ipcRenderer } from 'electron'

import { IpcChannel, IpcResponse } from '@arch/types'

export function createIpcInvoker<Data>(channel: IpcChannel): () => Promise<IpcResponse<Data>> {
  return async function invokeIpc() {
    return ipcRenderer.invoke(channel)
  }
}

export function createIpcInvokerWithPayload<Data, Payload = void>(
  channel: IpcChannel
): (payload: Payload) => Promise<IpcResponse<Data>> {
  return async function invokeIpcWithPayload(payload) {
    if (!payload) {
      return { status: 'error', error: `Invoked ${channel} without payload` }
    } else {
      return ipcRenderer.invoke(channel, payload)
    }
  }
}
