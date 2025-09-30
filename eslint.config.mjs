import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'

import { defineConfig } from 'eslint/config'

import { importConfig } from './configs/eslint-config/importConfig.mjs'
import { ignoresConfig } from './configs/eslint-config/ignoresConfig.mjs'
import { unusedImportsConfig } from './configs/eslint-config/unusedImportsConfig.mjs'
import { prettierConfig } from './configs/eslint-config/prettierConfig.mjs'
import { reactConfig } from './configs/eslint-config/reactConfig.mjs'
import { clientSimpleImportSortConfig } from './configs/eslint-config/simpleImportSortConfig.mjs'

export default defineConfig(
  // Ignores
  ignoresConfig,

  // Presets
  eslint.configs.recommended,
  tseslint.configs.recommended,

  // Globals
  importConfig,
  unusedImportsConfig,

  // Client
  reactConfig,
  clientSimpleImportSortConfig,

  // Server
  serverSimpleImportSortConfig,

  // Common
  commonSimpleImportSortConfig,

  // Prettier
  prettierConfig
)
