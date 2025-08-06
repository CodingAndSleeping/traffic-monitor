import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      doGetData: () => Promise<ITrafficInfo | null>
    }
  }
}
