import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import nextra from 'nextra'

// Trace from the monorepo root only when it is actually present. Vercel uploads
// just apps/web (Root Directory), so '../..' resolves to '/' there, and the
// Vercel builder then looks for .next/routes-manifest.json under a doubled
// path (/vercel/path0/vercel/path0/...), which fails the deploy.
const monorepoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const hasMonorepoRoot = fs.existsSync(path.join(monorepoRoot, 'turbo.json'))

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.js',
  search: {
    codeblocks: false
  },
})

export default withNextra({
  ...(hasMonorepoRoot ? { outputFileTracingRoot: monorepoRoot } : {}),
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
