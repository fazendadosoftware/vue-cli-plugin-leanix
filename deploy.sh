#!/usr/bin/env sh

# abort on errors
set -e

# build
yarn docs:build

# navigate into the build output directory
cd docs/.vuepress/dist

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy for github pages'

# if you are deploying to https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:fazendadosoftware/vue-cli-plugin-leanix.git master:gh-pages

cd -