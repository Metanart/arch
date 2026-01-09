import { ipcMain } from 'electron'

import { SHARED_IPC_CHANNELS } from '@arch/enums'

import { selectFolder } from './selectFolder'

export function setupSharedIpcHandlers(): void {
  ipcMain.handle(SHARED_IPC_CHANNELS.SELECT_FOLDER, selectFolder)
}
