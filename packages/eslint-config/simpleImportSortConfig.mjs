import simpleImportSort from 'eslint-plugin-simple-import-sort'

const CLIENT_GROUPS = [
  ['^react'],
  ['^@?\\w'],
  // 4. parent imports
  ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
  // 5. sibling imports
  ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
  // 6. style imports
  ['^.+\\.s?css$']
]

const SERVER_GROUPS = [
  ['^\\u0000', '^reflect-metadata$'], // side-effects / polyfills
  ['^electron'],
  ['^typeorm$'],
  ['^node:'], // Node built-ins
  ['^@?\\w'], // external deps (no React priority on server)
  ['^(@server|@shared|@)(/.*|$)'], // monorepo aliases (server/shared)
  ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
  ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$']
]

const COMMON_GROUPS = [
  ['^\\u0000'],
  ['^electron'],
  ['^@?\\w'],
  ['^(@shared|@)(/.*|$)'], // shared + root alias
  ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
  ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$']
]

function makeSimpleImportSortConfig({ name, files, groups }) {
  return {
    name,
    files,
    plugins: { 'simple-import-sort': simpleImportSort },
    rules: {
      'simple-import-sort/exports': 'error',
      'simple-import-sort/imports': ['error', { groups }]
    }
  }
}

export const clientSimpleImportSortConfig = makeSimpleImportSortConfig({
  name: 'simple-import-sort/client',
  files: [`./apps/client/**/*.{ts,tsx}`],
  groups: CLIENT_GROUPS
})

export const serverSimpleImportSortConfig = makeSimpleImportSortConfig({
  name: 'simple-import-sort/server',
  files: [`./apps/server/**/*.{ts}`],
  groups: SERVER_GROUPS
})

export const commonSimpleImportSortConfig = makeSimpleImportSortConfig({
  name: 'simple-import-sort/bridge',
  files: [`./apps/bridge/**/*.{ts}`, `./packages/**/*.{ts}`],
  groups: COMMON_GROUPS
})
