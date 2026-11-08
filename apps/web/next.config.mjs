import path from 'node:path'
import { fileURLToPath } from 'node:url'
import nextra from 'nextra'

const monorepoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..')

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.js',
  search: {
    codeblocks: false
  },
})

export default withNextra({
  outputFileTracingRoot: monorepoRoot,
  async redirects() {
    return [
      {
        source: '/docs',
        destination: '/docs/getting-started/with-react',
        permanent: false,
      },
      {
        source: '/docs/getting-started',
        destination: '/docs/getting-started/with-react',
        permanent: false,
      },
      {
        source: '/type/:slug*',
        destination: '/demo',
        permanent: false,
      }
    ]
  },
});
