#!/bin/sh

echo "Reseting dev environment..."

lerna clean --yes
rm -rf node_modules
yarn install

echo "Reset complete"
