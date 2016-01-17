#!/bin/bash -e

printf "Which tag do you want to build the docs for? "
read tag

rm -rf $tag
rm -rf docs

sha=`git rev-list -1 $tag`

git checkout $sha -- docs README.md
git reset docs

gitbook build

mv _book $tag
git clean docs  -f
git checkout README.md

# git add $tag
# git commit -m "Update $tag docs"
