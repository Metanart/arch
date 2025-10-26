import { ElectronAPI } from '@electron-toolkit/preload'

import { TCommonIpcInvokers } from '@shared/ipc'
import { TSettingsIpcInvokers } from '@domains/Settings'

declare global {
  interface Window {
    electron: ElectronAPI & TCommonIpcInvokers
    api: {
      settings: TSettingsIpcInvokers
    }
  }
}
