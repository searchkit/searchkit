#!/usr/bin/env node
const isPreRelease = process.env.BRANCH && process.env.BRANCH === "staging"
const isPublishStep = process.env.COMMIT_MESSAGE && process.env.COMMIT_MESSAGE.indexOf("publishing packages") != -1
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

if (isPreRelease) { // pre-release
  tagname = 'pre'
}

// Publish packages to npm registry
spawnWithErrorHandling('npm', [
  'run',
  'lerna',
  'publish',
  '--scope=searchkit, @searchkit/*',
  '--conventional-commits',
  '-cd-version prerelease'
], { stdio: 'inherit' });

// console.log('Pushing commit...');
// exec('git checkout staging');
// exec('git add .');
// exec(`git commit -m publish packages`);
// exec(`git push origin ${process.env.BRANCH}`);

// console.log('Done!');
