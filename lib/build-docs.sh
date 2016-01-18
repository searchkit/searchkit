#!/bin/bash -e

printf "Which tag do you want to build the docs for? "
read tag
printf "Which name would you like to give?"
read name

rm -rf $name
rm -rf docs

sha=`git rev-list -1 $tag`

git checkout $sha -- docs README.md
git reset docs

gitbook build

mv _book $name
git clean docs  -f
git checkout HEAD -- README.md
