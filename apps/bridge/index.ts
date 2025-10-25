import { contextBridge } from 'electron'

import { electronAPI } from '@electron-toolkit/preload'

import { settingsIpcInvokers } from '@domains/Settings'

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', {
      ...electronAPI
    })
    contextBridge.exposeInMainWorld('api', {
      settings: settingsIpcInvokers
    })
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-expect-error (define in dts)
  window.electron = electronAPI
  // @ts-expect-error (define in dts)
  window.api = api
}
