import simpleImportSort from 'eslint-plugin-simple-import-sort'

const CLIENT_GROUPS = [
  ['^react'],
  ['^notistack'],
  ['^@reduxjs'],
  ['^@react-hook-form'],
  ['^@react-error-boundary'],
  ['^@react-router-dom'],
  ['^@react-redux'],
  ['^@react-router'],
  ['^@react-router-dom'],
  ['^@react-router-dom'],
  ['^@hookform'],
  ['^@arch'],
  ['^@domains/Shared'],
  ['^@domains'],
  ['^@mui'],
  ['^@'],
  ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
  ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
  ['^\\.(?!/?$)', '^\\./?$'],
  ['^./enums'],
  ['^./types'],
  ['^.+\\.s?css$']
]

const SERVER_GROUPS = [
  ['^\\u0000', '^reflect-metadata$'],
  ['^node:'],
  ['^child_process'],
  ['^fs', '^crypto'],
  ['^electron'],
  ['^typeorm$'],
  ['^@arch'],
  ['^@domains/Shared'],
  ['^@domains'],
  ['^@?\\w'],
  ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
  ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
  ['^\\.(?!/?$)', '^\\./?$'],
  ['^./enums'],
  ['^./types']
]

const COMMON_GROUPS = [
  ['^\\u0000'],
  ['^electron'],
  ['^@arch'],
  ['^@domains/Shared'],
  ['^@domains'],
  ['^@?\\w'],
  ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
  ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
  ['^\\.(?!/?$)', '^\\./?$'],
  ['^./enums'],
  ['^./types']
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
  files: [`./apps/server/**/*.ts`],
  groups: SERVER_GROUPS
})

export const bridgeSimpleImportSortConfig = makeSimpleImportSortConfig({
  name: 'simple-import-sort/bridge',
  files: [`./apps/bridge/**/*.ts`],
  groups: COMMON_GROUPS
})

export const packagesSimpleImportSortConfig = makeSimpleImportSortConfig({
  name: 'simple-import-sort/packages',
  files: [`./packages/**/*.ts`],
  groups: COMMON_GROUPS
})
