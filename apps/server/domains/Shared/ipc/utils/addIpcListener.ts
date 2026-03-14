import { ipcMain } from 'electron'
import { IpcMainInvokeEvent } from 'electron/main'

import { TIpcChannel, IpcResponse } from '@arch/types'
import { getMessageFromError } from '@arch/utils'

export function addIpcListener<GData>(
  listener: () => Promise<IpcResponse<GData>>,
  channel: TIpcChannel
): void {
  async function wrappedListener(_event: IpcMainInvokeEvent): Promise<IpcResponse<GData>> {
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

export function addIpcListenerWithPayload<GData, GPayload>(
  listener: (payload: GPayload) => Promise<IpcResponse<GData>>,
  channel: TIpcChannel
): void {
  async function wrappedListener(
    _event: IpcMainInvokeEvent,
    payload: GPayload
  ): Promise<IpcResponse<GData>> {
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
