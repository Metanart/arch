import { SETTINGS_IPC_CHANNELS, SHARED_IPC_CHANNELS, SOURCES_IPC_CHANNELS } from '@arch/enums'

export type IpcError = {
  message: string
}
export type IpcResponse<GData> =
  | { status: 'success'; data: GData }
  | { status: 'error'; error: IpcError }

export type IpcChannel = SETTINGS_IPC_CHANNELS | SHARED_IPC_CHANNELS | SOURCES_IPC_CHANNELS

export type IpcQuery<GPayload = void> = {
  channel: IpcChannel
  payload?: GPayload
}
