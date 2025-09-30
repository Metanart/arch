import eslintPluginPrettier from 'eslint-plugin-prettier'
import eslintConfigPrettier from 'eslint-config-prettier'

export const prettierConfig = {
  plugins: { prettier: eslintPluginPrettier },
  rules: {
    'prettier/prettier': 'error',
    ...eslintConfigPrettier.rules
  }
}
