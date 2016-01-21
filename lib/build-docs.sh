#!/bin/bash -e

printf "Which tag do you want to build the docs for? "
read tag
printf "Which name would you like to give?"
read name

rm stable
rm -rf $name
rm -rf docs

sha=`git rev-list -1 $tag`

git checkout $sha -- docs README.md
git reset docs

node ./lib/updateVersion $name
gitbook build
mv _book $name
git clean docs  -f
git checkout HEAD -- README.md
ln -s $name stable
node ./lib/removeSelected
