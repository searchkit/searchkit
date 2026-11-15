const custom = require('eslint-config-custom')

module.exports = [
  { ignores: ['.next/**', 'node_modules/**', 'public/**'] },
  ...custom,
  {
    // Nextra's _meta.js loader only understands a literal `export default { ... }`.
    files: ['pages/**/_meta.js'],
    rules: {
      'import/no-anonymous-default-export': 'off'
    }
  }
]
