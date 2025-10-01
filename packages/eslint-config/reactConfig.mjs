import eslintPluginReact from 'eslint-plugin-react'
import eslintPluginReactHooks from 'eslint-plugin-react-hooks'
import eslintPluginReactRefresh from 'eslint-plugin-react-refresh'

import { clientFiles } from './utils.mjs'

export const reactConfig = {
  name: 'react/client',

  files: [clientFiles],

  plugins: {
    react: eslintPluginReact,
    'react-hooks': eslintPluginReactHooks,
    'react-refresh': eslintPluginReactRefresh
  },

  settings: {
    react: { version: 'detect' }
  },

  rules: {
    ...eslintPluginReact.configs.flat.recommended.rules,
    ...eslintPluginReact.configs.flat['jsx-runtime'].rules,
    ...eslintPluginReactHooks.configs.recommended.rules,
    ...eslintPluginReactRefresh.configs.vite.rules
  }
}
