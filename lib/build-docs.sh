#!/bin/bash -e

printf "Which tag do you want to build the docs for? "
read tag

rm -rf $tag
rm -rf docs

sha=`git rev-list -1 $tag`

git checkout $sha -- docs
git reset docs

mv docs/README.md SUMMARY.md
mv docs/* .

gitbook build

mv _book $tag

git add $tag
git commit -m "Update $tag docs"

git clean -f .
