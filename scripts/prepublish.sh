#!/bin/bash -e
printf "Which type of release would you like bump or minor or patch?"
read versionType
newVersion=`npm version --no-git-tag-version $versionType`
echo "Preparing new version ${newVersion}"
echo "export const VERSION = '${newVersion:1}'" > src/core/SearchkitVersion.ts

echo "Type enter when you have updated the CHANGELOG.md for ${newVersion}"
read proceed

echo "Running the release scripts"
rm -rf lib
rm -rf release
npm run-script build

echo "Type enter to commit and tag"
read proceed
git add .
git commit -m "Updating to version ${newVersion}"
git tag -a ${newVersion} -m "Updating to version ${newVersion}"
