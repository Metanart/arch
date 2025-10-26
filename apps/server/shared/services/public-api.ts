import { ipcMain } from 'electron'

import { ECommonIpcTags } from '@arch/enums'

import { DialogService } from './DialogService'

export function setupCommonIpcHandlers(): void {
  ipcMain.handle(ECommonIpcTags.DialogServiceSelectFolder, DialogService.selectFolder)
}
