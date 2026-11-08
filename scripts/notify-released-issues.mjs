// Comments "Fixed in <pkg>@<version>" on issues closed by PRs included in a release.
// Usage: node scripts/notify-released-issues.mjs '<json array of {name, version}>'
// Needs GH_TOKEN and GITHUB_REPOSITORY (owner/repo). Set DRY_RUN=1 to only print.
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { execFileSync } from 'node:child_process'

const repo = process.env.GITHUB_REPOSITORY || 'searchkit/searchkit'
const dry = !!process.env.DRY_RUN
const published = JSON.parse(process.argv[2] || '[]')

const gh = (...args) => execFileSync('gh', args, { encoding: 'utf8' })
const api = (path) => JSON.parse(gh('api', path))

const dirs = ['packages', 'examples'].flatMap((d) =>
  existsSync(d) ? readdirSync(d).map((n) => `${d}/${n}`) : []
)
const pkgDir = (name) =>
  dirs.find((d) => {
    try {
      return JSON.parse(readFileSync(`${d}/package.json`, 'utf8')).name === name
    } catch {
      return false
    }
  })

// Returns the PR numbers referenced in a package's CHANGELOG section for `version`.
// Supports changelog-github entries ("[#123](...)") and default entries (commit hash).
function prsForRelease(dir, version) {
  const log = readFileSync(`${dir}/CHANGELOG.md`, 'utf8')
  const start = log.indexOf(`## ${version}\n`)
  if (start === -1) return []
  const next = log.indexOf('\n## ', start + 1)
  const section = log.slice(start, next === -1 ? undefined : next)
  const prs = new Set()
  for (const m of section.matchAll(/\/pull\/(\d+)/g)) prs.add(Number(m[1]))
  for (const m of section.matchAll(/^- ([0-9a-f]{7,40}):/gm)) {
    try {
      for (const pr of api(`repos/${repo}/commits/${m[1]}/pulls`)) prs.add(pr.number)
    } catch {}
  }
  return [...prs]
}

function closedIssues(pr) {
  const [owner, name] = repo.split('/')
  const q = `query($o:String!,$n:String!,$p:Int!){repository(owner:$o,name:$n){pullRequest(number:$p){closingIssuesReferences(first:20){nodes{number}}}}}`
  const res = JSON.parse(
    gh('api', 'graphql', '-f', `query=${q}`, '-F', `o=${owner}`, '-F', `n=${name}`, '-F', `p=${pr}`)
  )
  return res.data.repository.pullRequest.closingIssuesReferences.nodes.map((n) => n.number)
}

for (const { name, version } of published) {
  const dir = pkgDir(name)
  if (!dir) continue
  const marker = `<!-- released-in:${name}@${version} -->`
  const body = `${marker}\nFixed in [\`${name}@${version}\`](https://www.npmjs.com/package/${name}/v/${version}).`
  for (const pr of prsForRelease(dir, version)) {
    for (const issue of closedIssues(pr)) {
      const comments = api(`repos/${repo}/issues/${issue}/comments?per_page=100`)
      if (comments.some((c) => c.body.includes(marker))) continue
      console.log(`#${issue} (via PR #${pr}): ${name}@${version}`)
      if (!dry) gh('issue', 'comment', String(issue), '--repo', repo, '--body', body)
    }
  }
}
