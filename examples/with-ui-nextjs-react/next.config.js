module.exports = {
  reactStrictMode: false,
  webpack: (config, { isServer }) => {
    if (isServer) {
      // `pg` (used by @searchkit/adapter-postgres) optionally requires `pg-native`, which isn't installed.
      // Leave that require to Node at runtime (it is only made when `pg.native` is used).
      config.externals = [...[].concat(config.externals || []), { 'pg-native': 'commonjs pg-native' }]
    }
    return config
  }
}
