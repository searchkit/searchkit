#!/bin/bash -e

printf "Which version should stable now point too?"
read tag

ln -s $tag stable
