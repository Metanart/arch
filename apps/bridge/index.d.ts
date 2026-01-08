import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    ipc: {
      Shared: SharedIpcInvokers
      Settings: SettingsIpcInvokers
    }
  }
}
