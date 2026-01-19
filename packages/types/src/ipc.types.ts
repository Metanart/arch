import { SETTINGS_IPC_CHANNELS, SHARED_IPC_CHANNELS, SOURCES_IPC_CHANNELS } from '@arch/enums'

export type IpcError = {
  message: string
}
export type IpcResponse<TData> =
  | { status: 'success'; data: TData }
  | { status: 'error'; error: IpcError }

export type IpcChannel = SETTINGS_IPC_CHANNELS | SHARED_IPC_CHANNELS | SOURCES_IPC_CHANNELS

export type IpcQuery<TPayload = void> = {
  channel: IpcChannel
  payload?: TPayload
}
