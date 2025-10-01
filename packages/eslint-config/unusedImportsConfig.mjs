import unusedImports from 'eslint-plugin-unused-imports'

export const unusedImportsConfig = {
  name: 'plugin/unused-imports',
  plugins: { 'unused-imports': unusedImports },
  rules: {
    // Remove unused imports completely
    'unused-imports/no-unused-imports': 'error',

    // Warn about unused variables, but ignore those starting with "_"
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_'
      }
    ],

    // Disable the core/TS variants in favor of unused-imports
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'off'
  }
}
