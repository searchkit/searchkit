## Setting up a development environment

Requirements:
- [Node.js](https://nodejs.org/en/) `^22.11 || ^24 || >=26`, matching `engines` in the root `package.json` (`.nvmrc`
  pins 22, so `nvm use` picks it up). Changesets 3 does not run on other versions.
- [pnpm](https://pnpm.io/) 12. The exact version is pinned in `packageManager` in the root `package.json`. Install it
  with `npm install -g pnpm@12` or the [standalone installer](https://pnpm.io/installation); if your pnpm is a
  different version (10 or newer) it switches to the pinned one automatically. Corepack is not needed: if you ran
  `corepack enable` before, its `pnpm` shim (next to `node`) can shadow your pnpm and fails with pnpm 12, so run
  `corepack disable pnpm`.

1. Clone the repository and install dependencies:

```bash
pnpm install
```

This also sets up the git hooks ([husky](https://typicode.github.io/husky/)): `pnpm lint` before each commit and
`pnpm test` before each push.

2. Build the project:

```bash
pnpm build
```

## Running Tests

We use [Jest](https://jestjs.io/) for testing. To run the tests, run `pnpm test` from the root of the project.

```bash
pnpm test
```

or running it in a particular package:

```bash
cd packages/searchkit
pnpm test
```

## Functional Tests

These tests run against mocks of the Elasticsearch API. 

Tests are located in the `packages/searchkit/src/___tests___/functional` directory.
Mocks are located in the `packages/searchkit/src/___tests___/mocks` directory.

We use `nock` to mock the HTTP request to Elasticsearch, returning a apprioriate response with a mock.

To run the functional tests, run `pnpm test` from within the `packages/searchkit` directory.

```bash
cd packages/searchkit
pnpm test
```

```bash
## End-to-end tests

The `e2e` workspace holds [Playwright](https://playwright.dev) tests that drive `examples/with-ui-nextjs-react`
in a real browser against a **real Elasticsearch** seeded with `sample-data/electronics-ecommerce`. Unlike the
functional tests above, nothing is mocked, so they validate that `searchkit`, `@searchkit/api` and
`@searchkit/instantsearch-client` work together. They run on every pull request in GitHub Actions
(`functional-tests` job in `.github/workflows/test.yml`).

Requirements: Docker, plus a one-off `npx playwright install chromium` from `e2e/`.

```bash
pnpm build          # the example uses the built workspace packages
pnpm e2e:up         # starts Elasticsearch (docker-compose.e2e.yml) and seeds the `products` index
pnpm test:e2e       # builds + starts the example on :3000 and runs the Playwright tests
pnpm e2e:down       # stops and removes Elasticsearch
```

- **Port 9200 already in use?** Use another port for both the container and the tests:
  `export E2E_ES_PORT=9290 ES_HOST=http://localhost:9290`, then run the commands above.
- `e2e/seed.mjs` **deletes and recreates the `products` index** on `ES_HOST`; only point it at a throwaway cluster.
- Re-run a single spec with `pnpm test:e2e tests/facets.spec.ts`; use `--ui` to debug. After a failure, open the
  report with `npx playwright show-report` (in `e2e/`). CI uploads the report and traces as an artifact on failure.
- The example reads `ES_HOST`, `ES_API_KEY` or `ES_USERNAME`/`ES_PASSWORD` from the environment and falls back to the
  public demo cluster when they are unset (see `examples/with-ui-nextjs-react/.env.example`).
- `e2e/check-workspace-links.mjs` fails the run if the example would use published packages instead of the ones in
  your branch (e.g. after a version bump that isn't mirrored in the example's `package.json`).
- To add a test, create `e2e/tests/<name>.spec.ts` and reuse `e2e/tests/helpers.ts`. Prefer assertions about
  behaviour (results narrow, banner shows) over exact counts so tests don't break when the sample data changes.

## Releasing

Releases are automated with [Changesets](https://github.com/changesets/changesets) and GitHub Actions; nothing is
published from a local machine.

1. **In your PR**, if you changed a published package (`packages/*`), run `pnpm changeset`. Pick the packages, the bump
   (`patch` / `minor` / `major` – use `major` for breaking changes) and write a summary. Commit the generated
   `.changeset/*.md` file. PRs that don't need a release (docs, CI) can use the `no-release` label.
2. **When the PR merges to `main`**, the `Release` workflow opens or updates a **"chore: version packages"** PR that
   bumps versions and updates the CHANGELOGs.
3. **Merge that PR** to publish to npm, tag the release and create GitHub Releases.

One-time setup: for each published package (`searchkit`, `@searchkit/api`, `@searchkit/instantsearch-client`) configure npm **trusted publishing** pointing at
`searchkit/searchkit` and workflow `release.yml`. `changeset publish` runs `pnpm publish`, which does the OIDC token
exchange and signs provenance itself, so no npm token is stored in the repo. Also enable
"Allow GitHub Actions to create and approve pull requests" in the repo's Actions settings.

After a publish, the `Release` workflow also:

- **Comments "Fixed in `pkg@version`"** on every issue closed by a PR in the release (found via the PR's closing
  references; `scripts/notify-released-issues.mjs`). Write `Fixes #123` in the PR description for this to work.
  Changelog entries link to their PR via `@changesets/changelog-github`.
- **Verifies the release** (`verify-published` job): waits for the new versions to appear on npm, installs them into a
  copy of the Next.js example (`scripts/prepare-published-example.mjs`) and runs the Playwright functional tests against
  a real Elasticsearch. Locally: `node scripts/prepare-published-example.mjs /tmp/app` then
  `E2E_APP_DIR=/tmp/app pnpm test:e2e`.
