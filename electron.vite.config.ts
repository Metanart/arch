import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import type { UserConfig } from 'vite'

const typeOrmDriverExternals = [
  'typeorm',
  'sqlite3',
  '@google-cloud/spanner',
  'pg',
  'pg-native',
  'pg-pool',
  'pg-query-stream',
  'mysql',
  'mysql2',
  'oracledb',
  'mongodb',
  'redis',
  'ioredis',
  'better-sqlite3',
  '@sap/hana-client',
  'hdb-pool',
  'tedious'
]

const main: UserConfig = {
  build: {
    outDir: 'build/main',
    lib: {
      entry: 'apps/server/index.ts',
      formats: ['cjs']
    },
    rollupOptions: {
      external: [...typeOrmDriverExternals, /^typeorm(\/.*)?$/]
    }
  },
  resolve: {
    alias: [
      {
        find: /^@server\/(.+)$/,
        replacement: resolve(__dirname, 'apps/server/domains/$1/public-api.ts')
      }
    ]
  },
  plugins: [externalizeDepsPlugin()]
}

const preload: UserConfig = {
  build: {
    outDir: 'build/preload',
    lib: {
      entry: resolve('apps/bridge/index.ts'),
      formats: ['cjs']
    }
  },
  resolve: {
    alias: [
      {
        find: /^@bridge\/(.+)$/,
        replacement: resolve(__dirname, 'apps/bridge/domains/$1/public-api.ts')
      }
    ]
  },
  plugins: [externalizeDepsPlugin()]
}

const renderer: UserConfig = {
  root: 'apps/client',
  build: {
    outDir: 'build/renderer',
    rollupOptions: { input: 'apps/client/index.html' }
  },
  resolve: {
    alias: [
      {
        find: /^@client\/(.+)$/,
        replacement: resolve('apps/client/domains/$1/public-api.ts')
      }
    ]
  },
  plugins: [react()]
}

export default defineConfig({ main, preload, renderer })
