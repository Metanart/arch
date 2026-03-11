// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="vitest/config" />

import { defineConfig } from 'vitest/config'
import { resolve } from 'node:path'

export default defineConfig({
  resolve: {
    alias: [
      {
        find: /^@domains\/(.+)$/,
        replacement: resolve(__dirname, 'apps/server/domains/$1/public-api.ts')
      }
    ]
  },
  test: {
    include: ['**/*.test.ts', '**/*.test.tsx'],
    environment: 'node'
  }
})
