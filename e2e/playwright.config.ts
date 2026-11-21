import { defineConfig, devices } from '@playwright/test'

const PORT = Number(process.env.E2E_PORT || 3000)
// When set, serve this prepared copy of the example (built from packages installed from npm, see
// scripts/prepare-published-example.mjs) instead of the workspace example. That run uses a copy of this directory
// installed from npm too, so the tests' own searchkit imports are the published packages.
const APP_DIR = process.env.E2E_APP_DIR
const ES_HOST = process.env.ES_HOST || 'http://localhost:9200'

// The same specs also run against Postgres (project `chromium-postgres`): the example started a second time,
// on its own port, with SEARCH_ADAPTER=postgres. Run one side with --project=chromium / chromium-postgres.
const POSTGRES_PORT = Number(process.env.E2E_POSTGRES_PORT || 3001)
const DATABASE_URL =
  process.env.DATABASE_URL || 'postgres://postgres:searchkit@localhost:5432/postgres'

const appCommand = (port: number, build: boolean) => {
  if (APP_DIR) return build ? `npm run build && npm start -- -p ${port}` : `npm start -- -p ${port}`
  const start = `pnpm --filter with-ui-nextjs-react start -p ${port}`
  return build ? `pnpm --filter with-ui-nextjs-react build && ${start}` : start
}

const webServer = (port: number, build: boolean, env: Record<string, string>) => ({
  command: appCommand(port, build),
  cwd: APP_DIR || '..',
  url: `http://localhost:${port}`,
  reuseExistingServer: !process.env.CI,
  timeout: 300_000,
  // the example runs with debug logging that prints every search request/response; keep only errors
  stdout: 'ignore' as const,
  stderr: 'pipe' as const,
  env: { ...env, PORT: String(port) }
})

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    trace: 'retain-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], baseURL: `http://localhost:${PORT}` }
    },
    {
      name: 'chromium-postgres',
      use: { ...devices['Desktop Chrome'], baseURL: `http://localhost:${POSTGRES_PORT}` },
      // these build their own Elasticsearch index in-process and never use the example app, so they do not
      // test Postgres (and running them in both projects would race on those shared indices)
      testIgnore: /(escaped-facet-values|facet-search-words|facet-value-order)\.spec\.ts/
    }
  ],
  // Builds examples/with-ui-nextjs-react (which uses the workspace searchkit packages) once and serves it
  // against the local Elasticsearch, and a second time against the local Postgres. Web servers start in order,
  // so the build in the first one is done before the second starts. Run `pnpm build` at the repo root first
  // so packages have a dist/.
  webServer: [
    webServer(PORT, true, { ES_HOST, SEARCH_ADAPTER: 'elasticsearch' }),
    webServer(POSTGRES_PORT, false, { SEARCH_ADAPTER: 'postgres', DATABASE_URL })
  ]
})
