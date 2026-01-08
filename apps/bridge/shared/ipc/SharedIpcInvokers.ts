import { ipcRenderer } from 'electron'

import { SHARED_IPC_CHANNELS } from '@arch/enums'

export const sharedIpcInvokers = {
  [SHARED_IPC_CHANNELS.SELECT_FOLDER]: (): Promise<string | null> =>
    ipcRenderer.invoke(SHARED_IPC_CHANNELS.SELECT_FOLDER)
} as const

export type SharedIpcInvokers = typeof sharedIpcInvokers
