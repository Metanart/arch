import { SETTINGS_IPC_CHANNELS, SHARED_IPC_CHANNELS } from '@arch/enums'

export type IpcError = {
  message: string
}
export type IpcResponse<Data> =
  | { status: 'success'; data: Data }
  | { status: 'error'; error: IpcError }

export type IpcChannel = SETTINGS_IPC_CHANNELS | SHARED_IPC_CHANNELS

export type IpcQuery<Payload = void> = {
  channel: IpcChannel
  payload?: Payload
}
