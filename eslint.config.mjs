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
  packagesSimpleImportSortConfig,
  bridgeSimpleImportSortConfig
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

  // Server
  serverSimpleImportSortConfig,

  // Bridge
  bridgeSimpleImportSortConfig,

  // Client
  reactConfig,
  clientSimpleImportSortConfig,

  // Packages
  packagesSimpleImportSortConfig,

  // Prettier
  prettierConfig
)
