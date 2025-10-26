import { ipcRenderer } from 'electron'

import { ECommonIpcTags } from '@arch/enums'

const { DialogServiceSelectFolder } = ECommonIpcTags

export const commonIpcInvokers = {
  selectFolder: (): Promise<string | null> => ipcRenderer.invoke(DialogServiceSelectFolder)
} as const

export type TCommonIpcInvokers = typeof commonIpcInvokers
