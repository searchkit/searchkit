const withTM = require('next-transpile-modules')([
  '@searchkit/apollo-resolvers',
  '@searchkit/client'
])

module.exports = withTM({})
