import { ipcMain } from 'electron'
import { IpcMainInvokeEvent } from 'electron/main'

import { IpcChannel, IpcResponse } from '@arch/types'
import { getMessageFromError } from '@arch/utils'

export function addIpcListener<TData>(
  listener: () => Promise<IpcResponse<TData>>,
  channel: IpcChannel
): void {
  async function wrappedListener(_event: IpcMainInvokeEvent): Promise<IpcResponse<TData>> {
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

export function addIpcListenerWithPayload<TData, TPayload>(
  listener: (payload: TPayload) => Promise<IpcResponse<TData>>,
  channel: IpcChannel
): void {
  async function wrappedListener(
    _event: IpcMainInvokeEvent,
    payload: TPayload
  ): Promise<IpcResponse<TData>> {
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
