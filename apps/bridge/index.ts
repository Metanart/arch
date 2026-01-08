import { contextBridge } from 'electron'

import { electronAPI } from '@electron-toolkit/preload'

import { settingsIpcInvokers } from '@domains/Settings'
import { createLogger } from '@arch/utils'
import { sharedIpcInvokers } from '@shared/ipc'

const logger = createLogger({ layer: 'IPC', domain: 'Global', origin: 'Bridge invokers expose' })

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', {
      ...electronAPI
    })
    contextBridge.exposeInMainWorld('ipc', {
      Shared: sharedIpcInvokers,
      Settings: settingsIpcInvokers
    })
  } catch (error) {
    logger.error(error)
  }
} else {
  // @ts-expect-error (define in dts)
  window.electron = electronAPI
  // @ts-expect-error (define in dts)
  window.api = api
}
