const custom = require('eslint-config-custom')

module.exports = [
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/lib/**',
      '**/build/**',
      '**/coverage/**',
      '**/.next/**',
      '.claude/**'
    ]
  },
  ...custom,
  {
    settings: {
      next: {
        rootDir: ['apps/*/', 'examples/*/']
      }
    }
  }
]
