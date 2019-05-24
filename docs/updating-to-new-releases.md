---
id: updating-to-new-releases
title: Updating to New Releases
---

Create React SSR App is divided into two packages:

- `create-react-ssr-app` is a global command-line utility that you use to create new projects.
- `react-ssr-scripts` is a development dependency in the generated projects (including this one).

When you run `npx create-react-ssr-app my-app` it automatically installs the latest version of Create React SSR App.

> If you've previously installed `create-react-ssr-app` globally via `npm install -g create-react-ssr-app`, please visit [Getting Started](getting-started.md) to learn about current installation steps.

Create React SSR App creates the project with the latest version of `react-ssr-scripts` so you’ll get all the new features and improvements in newly created apps automatically.

To update an existing project to a new version of `react-ssr-scripts`, [open the changelog](https://github.com/trustworktech/create-react-ssr-app/blob/master/CHANGELOG.md), find the version you’re currently on (check `package.json` in this folder if you’re not sure), and apply the migration instructions for the newer versions.

In most cases bumping the `react-ssr-scripts` version in `package.json` and running `npm install` (or `yarn install`) in this folder should be enough, but it’s good to consult the [changelog](https://github.com/trustworktech/create-react-ssr-app/blob/master/CHANGELOG.md) for potential breaking changes.

We commit to keeping the breaking changes minimal so you can upgrade `react-ssr-scripts` painlessly.
