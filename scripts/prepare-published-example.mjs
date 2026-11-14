// Builds a copy of examples/with-ui-nextjs-react that uses the searchkit packages published on npm
// (at the versions currently in this repo) instead of the workspace ones. Used to smoke-test a release.
// Usage: node scripts/prepare-published-example.mjs <destDir>
import { cpSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { join, resolve } from 'node:path'

const root = resolve(new URL('..', import.meta.url).pathname)
const dest = resolve(process.argv[2] || '')
if (!process.argv[2]) throw new Error('usage: prepare-published-example.mjs <destDir>')

const packages = {
  searchkit: 'packages/searchkit',
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

cpSync(join(root, 'examples/with-ui-nextjs-react'), dest, {
  recursive: true,
  filter: (src) => !/\/(node_modules|\.next|\.turbo)(\/|$)/.test(src)
})
const pkgPath = join(dest, 'package.json')
const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
// Pin every other dependency to the version the workspace resolved (pnpm-lock.yaml), so the run only varies
// the searchkit packages and isn't affected by newer releases of e.g. react-instantsearch.
const installedVersion = (dep) => {
  for (const base of ['examples/with-ui-nextjs-react', '.']) {
    const file = join(root, base, 'node_modules', dep, 'package.json')
    if (existsSync(file)) return JSON.parse(readFileSync(file, 'utf8')).version
  }
}
for (const dep of Object.keys(pkg.dependencies)) {
  if (dep in versions) continue
  pkg.dependencies[dep] = installedVersion(dep) ?? pkg.dependencies[dep]
}
Object.assign(pkg.dependencies, versions)
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')

// outside the workspace, so a plain npm install pulls everything from the registry
execFileSync('npm', ['install', '--no-audit', '--no-fund', '--legacy-peer-deps'], {
  cwd: dest,
  stdio: 'inherit'
})

for (const [name, version] of Object.entries(versions)) {
  const installed = join(dest, 'node_modules', name, 'package.json')
  if (!existsSync(installed) || JSON.parse(readFileSync(installed, 'utf8')).version !== version) {
    throw new Error(`${name} installed from npm is not ${version}`)
  }
  console.log(`ok  ${name}@${version} installed from npm`)
}
