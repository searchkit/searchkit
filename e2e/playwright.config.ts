import { defineConfig, devices } from '@playwright/test'

const PORT = Number(process.env.E2E_PORT || 3000)
const ES_HOST = process.env.ES_HOST || 'http://localhost:9200'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure'
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  // Builds and serves examples/with-ui-nextjs-react (which uses the workspace searchkit packages)
  // against the local Elasticsearch. Run `yarn build` at the repo root first so packages have a dist/.
  webServer: {
    command: `yarn workspace with-ui-nextjs-react build && yarn workspace with-ui-nextjs-react start -p ${PORT}`,
    cwd: '..',
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 300_000,
    // the example runs with debug logging that prints every ES request/response; keep only errors
    stdout: 'ignore',
    stderr: 'pipe',
    env: { ES_HOST, PORT: String(PORT) }
  }
})
