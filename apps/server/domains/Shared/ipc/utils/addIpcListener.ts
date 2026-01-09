import { ipcMain } from 'electron'
import { IpcMainInvokeEvent } from 'electron/main'

import { IpcChannel, IpcResponse } from '@arch/types'
import { getMessageFromError } from '@arch/utils'

export function addIpcListener<Data>(
  listener: () => Promise<IpcResponse<Data>>,
  channel: IpcChannel
): void {
  async function wrappedListener(_event: IpcMainInvokeEvent): Promise<IpcResponse<Data>> {
    try {
      return await listener()
    } catch (error) {
      const message = getMessageFromError(error)

      return {
        status: 'error',
        error: {
          message
        }
      }
    }
  }

  ipcMain.handle(channel, wrappedListener)
}

export function addIpcListenerWithPayload<Data, Payload>(
  listener: (payload: Payload) => Promise<IpcResponse<Data>>,
  channel: IpcChannel
): void {
  async function wrappedListener(
    _event: IpcMainInvokeEvent,
    payload: Payload
  ): Promise<IpcResponse<Data>> {
    try {
      return await listener(payload)
    } catch (error) {
      const message = getMessageFromError(error)

      return {
        status: 'error',
        error: {
          message
        }
      }
    }
  }

  ipcMain.handle(channel, wrappedListener)
}
