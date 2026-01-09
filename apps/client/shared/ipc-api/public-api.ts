import { SHARED_IPC_CHANNELS } from '@arch/enums'
import { IpcChannel } from '@arch/types'

async function callSharedIpcMethod<Data>(channel: IpcChannel): Promise<Data> {
  const ipcMethod = window.ipc.Shared[channel]

  if (!ipcMethod || typeof ipcMethod !== 'function') {
    throw new Error(`The shared ipc method for channel ${channel} could not be found.`)
  }

  return await ipcMethod()
}

const selectFolder = async function () {
  return callSharedIpcMethod<string | null>(SHARED_IPC_CHANNELS.SELECT_FOLDER)
}

export const SharedIpcApi = {
  selectFolder
}
