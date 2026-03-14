import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    ipc: {
      Shared: TSharedIpcInvokers
      Settings: TSettingsIpcInvokers
      Sources: TSourcesIpcInvokers
    }
  }
}
