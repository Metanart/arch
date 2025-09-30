import importPlugin from 'eslint-plugin-import'

export const importConfig = {
  name: 'import',
  plugins: { import: importPlugin },
  settings: {
    'import/resolver': {
      typescript: {
        project: ['./tsconfig.json']
      }
    }
  },
  rules: {
    'import/no-duplicates': 'error',
    'import/newline-after-import': 'error'
  }
}
