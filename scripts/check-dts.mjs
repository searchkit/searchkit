// CI guard (`pnpm --filter <package> run check:dts`, after a build, from a package directory): the
// published type declarations must be self-contained.
// Every module dist/index.d.ts imports must be a relative path or one of the package's `dependencies`
// / `peerDependencies`. Packages that use a devDependency only for types (e.g. @elastic/elasticsearch)
// inline those types with tsup (see each tsup.config.js). If an import of a devDependency ever reaches
// dist, TypeScript users without it, or with a version whose `exports` hide the path, get
// "Cannot find module".
import { readFileSync } from 'node:fs'
import { builtinModules } from 'node:module'

const pkg = JSON.parse(readFileSync('package.json', 'utf8'))
const allowed = new Set([
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {})
])

const files = ['dist/index.d.ts', 'dist/index.d.mts'].filter((f) => {
  try {
    readFileSync(f)
    return true
  } catch {
    return false
  }
})

if (files.length === 0) {
  console.error('check-dts: no type declarations found in dist/')
  process.exit(1)
}

// `from '...'`, `import '...'` and `import('...')`
const specifiers = /(?:from\s+|import\s*\(?\s*)['"]([^'"]+)['"]/g
const packageName = (specifier) =>
  specifier.startsWith('@') ? specifier.split('/').slice(0, 2).join('/') : specifier.split('/')[0]

let failed = false
for (const file of files) {
  const lines = readFileSync(file, 'utf8').split('\n')
  lines.forEach((line, i) => {
    for (const [, specifier] of line.matchAll(specifiers)) {
      if (specifier.startsWith('.')) continue
      const name = packageName(specifier)
      if (allowed.has(name)) continue
      if (specifier.startsWith('node:') || builtinModules.includes(name)) continue
      console.error(
        `check-dts: ${pkg.name} ${file}:${i + 1} imports "${specifier}", which is not a dependency: ${line.trim()}`
      )
      failed = true
    }
  })
}

if (failed) process.exit(1)
console.log(`check-dts: ${pkg.name} ${files.join(', ')} are self-contained`)
