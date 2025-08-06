/// <reference types="vite/client" />

import type { ElectronAPI } from '@electron-toolkit/preload'

interface ImportMetaEnv {
  readonly MAIN_VITE_USERNAME: string
  readonly MAIN_VITE_PASSWORD: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare global {
  interface Window {
    electron: ElectronAPI
  }
}

// src/renderer/src/env.d.ts
declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}
