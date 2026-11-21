const next = require('eslint-config-next')
const prettier = require('eslint-config-prettier/flat')
const turbo = require('eslint-plugin-turbo')

/** Shared ESLint flat config for the Searchkit monorepo. */
module.exports = [
  ...next,
  {
    name: 'searchkit/turbo',
    plugins: { turbo },
    rules: {
      'turbo/no-undeclared-env-vars': 'error'
    }
  },
  {
    name: 'searchkit/overrides',
    rules: {
      '@next/next/no-html-link-for-pages': 'off',
      'react/jsx-key': 'off'
    }
  },
  prettier
]
