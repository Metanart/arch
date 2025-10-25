import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'

import { defineConfig } from 'eslint/config'

import {
  importConfig,
  ignoresConfig,
  unusedImportsConfig,
  prettierConfig,
  reactConfig,
  clientSimpleImportSortConfig,
  serverSimpleImportSortConfig,
  commonSimpleImportSortConfig
} from '@arch/eslint-config'

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
