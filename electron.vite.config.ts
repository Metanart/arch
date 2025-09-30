import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import { resolve } from 'node:path'

import react from '@vitejs/plugin-react'

export const aliases = {
  server: {
    find: /^@server\/(.+)$/,
    replacement: resolve('apps/server/domains/$1/public-api.ts')
  },
  client: {
    find: /^@client\/(.+)$/,
    replacement: resolve('apps/client/domains/$1/public-api.ts')
  },
  bridge: {
    find: /^@bridge\/(.+)$/,
    replacement: resolve('apps/bridge/domains/$1/public-api.ts')
  }
}

const electronServerConfig = {
  root: 'apps/server',
  build: {
    lib: {
      entry: 'index.ts'
    }
  },
  resolve: {
    alias: [aliases.server]
  },
  plugins: [externalizeDepsPlugin()]
}

const electronBridgeConfig = {
  root: 'apps/bridge',
  build: {
    lib: {
      entry: 'index.ts'
    }
  },
  resolve: {
    alias: [aliases.bridge]
  },
  plugins: [externalizeDepsPlugin()]
}

const electronClientConfig = {
  root: 'apps/client',
  build: {
    rollupOptions: {
      input: 'index.html'
    }
  },
  resolve: {
    alias: [aliases.client]
  },
  plugins: [react()]
}

export default defineConfig({
  main: electronServerConfig,
  preload: electronBridgeConfig,
  renderer: electronClientConfig
})
