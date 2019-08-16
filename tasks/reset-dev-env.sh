#!/bin/sh

echo "Reseting dev environment..."

lerna clean --yes
rm -rf node_modules
rm yarn.lock
yarn install

echo "Reset complete"
