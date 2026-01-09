import { contextBridge } from 'electron'

import { createLogger } from '@arch/utils'

import { sharedIpcInvokers } from '@domains/Shared'

import { settingsIpcInvokers } from '@domains/Settings'
import { sourcesIpcInvokers } from '@domains/Sources'

import { electronAPI } from '@electron-toolkit/preload'

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
      Settings: settingsIpcInvokers,
      Sources: sourcesIpcInvokers
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
