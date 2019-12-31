#!/usr/bin/env node
const isProdRelease = process.env.BRANCH && process.env.BRANCH === 'master'
const isPublishCommit = process.env.PUBLISH_COMMIT && process.env.PUBLISH_COMMIT === 'Publish'
const exec = require('child_process').execSync
const spawn = require('cross-spawn')

const spawnWithErrorHandling = (...args) => {
  const results = spawn.sync(...args)
  if (results.error) {
    throw results.error
  }
}

// Set dist-tag
const tasks = ['run', 'lerna', 'publish', '--', '--yes']

if (!isProdRelease) {
  // pre-release
  tasks.push('--cd-version=prerelease')
} else {
  tasks.push('--conventional-commits')
}

if (!isPublishCommit) {
  // Publish packages to npm registry
  spawnWithErrorHandling('npm', tasks, { stdio: 'inherit' })

  try {
    console.log('Pushing commit...')
    exec('git add .')
    exec(`git commit -m 'Publish'`)
    exec(`git push origin ${process.env.BRANCH}`)
  } catch (e) {}

  console.log('Done!')
}
