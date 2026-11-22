// Prepares a release smoke test that uses the searchkit packages published on npm (at the versions currently in this
// repo) instead of the workspace ones, the way someone installing from npm gets them:
//   <destDir>/app  copy of examples/with-ui-nextjs-react
//   <destDir>/e2e  copy of the Playwright tests (their own `import ... from 'searchkit'` resolve to npm too)
// Both are outside the workspace and installed with plain npm.
// Usage: node scripts/prepare-published-example.mjs <destDir>
import { cpSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { join, resolve } from 'node:path'

const root = resolve(new URL('..', import.meta.url).pathname)
const dest = resolve(process.argv[2] || '')
if (!process.argv[2]) throw new Error('usage: prepare-published-example.mjs <destDir>')

const packages = {
  'searchkit': 'packages/searchkit',
  '@searchkit/adapter-postgres': 'packages/adapter-postgres',
  '@searchkit/api': 'packages/searchkit-api',
  '@searchkit/instantsearch-client': 'packages/searchkit-instantsearch-client'
}
const versions = Object.fromEntries(
  Object.entries(packages).map(([name, dir]) => [
    name,
    JSON.parse(readFileSync(join(root, dir, 'package.json'), 'utf8')).version
  ])
)

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const onNpm = (spec) => {
  try {
    return execFileSync('npm', ['view', spec, 'version'], { encoding: 'utf8' }).trim() !== ''
  } catch {
    return false
  }
}

// npm can take a couple of minutes to serve a freshly published version
for (const [name, version] of Object.entries(versions)) {
  const deadline = Date.now() + 10 * 60 * 1000
  while (!onNpm(`${name}@${version}`)) {
    if (Date.now() > deadline) throw new Error(`${name}@${version} is not on npm after 10 minutes`)
    console.log(`waiting for ${name}@${version} on npm...`)
    await sleep(15_000)
  }
  console.log(`found ${name}@${version} on npm`)
}

// Copies a workspace project to dest, sets the searchkit packages to the published versions and pins every other
// dependency to the version the workspace resolved (pnpm-lock.yaml), so the run only varies the searchkit packages
// and isn't affected by newer releases of e.g. react-instantsearch. Then installs it from the registry.
const prepare = (project, to, { addAll = false } = {}) => {
  cpSync(join(root, project), to, {
    recursive: true,
    filter: (src) =>
      !/\/(node_modules|\.next|\.turbo|playwright-report|test-results)(\/|$)/.test(src)
  })
  const pkgPath = join(to, 'package.json')
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
  const installedVersion = (dep) => {
    for (const base of [project, '.']) {
      const file = join(root, base, 'node_modules', dep, 'package.json')
      if (existsSync(file)) return JSON.parse(readFileSync(file, 'utf8')).version
    }
  }
  const searchkitDeps = []
  for (const field of ['dependencies', 'devDependencies']) {
    for (const dep of Object.keys(pkg[field] ?? {})) {
      if (dep in versions) {
        pkg[field][dep] = versions[dep]
        searchkitDeps.push(dep)
      } else {
        pkg[field][dep] = installedVersion(dep) ?? pkg[field][dep]
      }
    }
  }
  if (addAll) {
    Object.assign(pkg.dependencies, versions)
    searchkitDeps.splice(0, searchkitDeps.length, ...Object.keys(versions))
  }
  for (const [field, deps] of Object.entries(pkg)) {
    if (!/dependencies$/i.test(field)) continue
    const workspaceDep = Object.entries(deps).find(([, range]) =>
      String(range).startsWith('workspace:')
    )
    if (workspaceDep) throw new Error(`${project}: ${workspaceDep[0]} is still ${workspaceDep[1]}`)
  }
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')

  // outside the workspace, so a plain npm install pulls everything from the registry
  execFileSync('npm', ['install', '--no-audit', '--no-fund', '--legacy-peer-deps'], {
    cwd: to,
    stdio: 'inherit'
  })

  for (const name of searchkitDeps) {
    const installed = join(to, 'node_modules', name, 'package.json')
    if (
      !existsSync(installed) ||
      JSON.parse(readFileSync(installed, 'utf8')).version !== versions[name]
    ) {
      throw new Error(`${project}: ${name} installed from npm is not ${versions[name]}`)
    }
    console.log(`ok  ${project}: ${name}@${versions[name]} installed from npm`)
  }
}

prepare('examples/with-ui-nextjs-react', join(dest, 'app'), { addAll: true })
prepare('e2e', join(dest, 'e2e'))
