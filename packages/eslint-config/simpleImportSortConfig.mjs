import simpleImportSort from 'eslint-plugin-simple-import-sort'

const COMMON_GROUPS = [
  // Side-effect imports
  ['^\\u0000'],

  // External packages
  ['^[a-zA-Z]', '^@?[a-zA-Z]'],

  // Internal aliases
  ['^@arch'],
  ['^@/'],
  ['^@'],

  // Parent imports
  ['^\\.\\.(?!/?$)', '^\\.\\./?$'],

  // Same-folder imports
  ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],

  // Specific local groups
  ['^./enums'],
  ['^./types'],

  // Styles
  ['^.+\\.s?css$']
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
  groups: COMMON_GROUPS
})

export const serverSimpleImportSortConfig = makeSimpleImportSortConfig({
  name: 'simple-import-sort/server',
  files: [`./apps/server/**/*.ts`],
  groups: COMMON_GROUPS
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
