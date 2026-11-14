// Build-time guard: the published type declarations must be self-contained.
// searchkit uses @elastic/elasticsearch only for types (it is a devDependency), so tsup inlines
// those types (see tsup.config.js). If an import of it ever reaches dist, TypeScript users
// without the client, or with a client whose `exports` hide the path, get "Cannot find module".
import { readFileSync } from 'node:fs'

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

const forbidden = /from ['"](@elastic\/elasticsearch|@algolia\/client-search)[^'"]*['"]/
let failed = false
for (const file of files) {
  const lines = readFileSync(file, 'utf8').split('\n')
  lines.forEach((line, i) => {
    if (forbidden.test(line)) {
      console.error(`check-dts: ${file}:${i + 1} imports a devDependency: ${line.trim()}`)
      failed = true
    }
  })
}

if (failed) process.exit(1)
console.log(`check-dts: ${files.join(', ')} are self-contained`)
