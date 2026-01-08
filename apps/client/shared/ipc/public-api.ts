import { SHARED_IPC_CHANNELS } from '@arch/enums'

async function selectFolder(): Promise<string | null> {
  const ipcMethod = window.ipc.Shared[SHARED_IPC_CHANNELS.SELECT_FOLDER]

  if (!ipcMethod || typeof ipcMethod !== 'function') {
    throw new Error('IPC method is not found')
  }

  return await ipcMethod()
}

export const SharedIpcMethods = {
  selectFolder
}
