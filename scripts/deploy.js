#!/usr/bin/env node

if (process.argv.length <= 2 || !/\d+\.\d+\.\d+.*/.test(process.argv[2])) {
  console.error('Invalid version specified.');
  process.exit(1);
}

const version = process.argv[2].replace('v', '');
const spawn = require('cross-spawn');
const exec = require('child_process').execSync;

const spawnWithErrorHandling = (...args) => {
  const results = spawn.sync(...args);
  if (results.error) {
    throw results.error;
  }
};

// Set dist-tag
let tagname = 'latest'; // stable

if (version.includes('-')) { // pre-release
  const regex = version.match(/-(.+)\./);
  if (regex) {
    tagname = regex[1]; // parse type of pre-release
  } else {
    tagname = 'pre'; // default to `pre` if no match
  }
}

// Publish packages to npm registry
spawnWithErrorHandling('npm', [
  'run',
  'lerna',
  'publish',
  '--',
  '--skip-git',
  '--repo-version',
  version,
  '--npm-tag',
  tagname,
  '--yes',
  '--scope=searchkit',
  '--force-publish=*',
  '--exact',
  ...process.argv.slice(3),
], { stdio: 'inherit' });

console.log('Pushing commit...');
exec('git checkout staging');
exec('git add .');
exec(`git commit -m v${version}`);
exec(`git push origin ${process.env.BRANCH}`);

console.log('Done!');
