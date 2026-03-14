import { SETTINGS_IPC_CHANNELS, SHARED_IPC_CHANNELS, SOURCES_IPC_CHANNELS } from '@arch/enums'

export type TIpcError = {
  message: string
}
export type IpcResponse<GData> =
  | { status: 'success'; data: GData }
  | { status: 'error'; error: TIpcError }

export type TIpcChannel = SETTINGS_IPC_CHANNELS | SHARED_IPC_CHANNELS | SOURCES_IPC_CHANNELS

export type IpcQuery<GPayload = void> = {
  channel: TIpcChannel
  payload?: GPayload
}
