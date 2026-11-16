// Fails if the example app would run published searchkit packages instead of the ones in this repo.
// This can happen when the example's dependency range doesn't match the workspace package's version.
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const requireFromExample = createRequire(
  join(root, 'examples', 'with-ui-nextjs-react', 'package.json')
)
const packages = ['@searchkit/api', '@searchkit/instantsearch-client', 'searchkit']

let failed = false
for (const name of packages) {
  const resolved = requireFromExample.resolve(name) // resolves symlinks to the real path
  const isWorkspace = resolved.startsWith(join(root, 'packages') + '/')
  console.log(`${isWorkspace ? 'ok  ' : 'FAIL'} ${name} -> ${resolved}`)
  if (!isWorkspace) failed = true
}

if (failed) {
  console.error(
    '\nThe example resolves a published package instead of the workspace one. ' +
      'Use a range the workspace version satisfies (the examples use "*") in ' +
      'examples/with-ui-nextjs-react/package.json; pnpm links it to the workspace package ' +
      '(linkWorkspacePackages in pnpm-workspace.yaml).'
  )
  process.exit(1)
}
