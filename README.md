<!-- A spacer -->
<p>&nbsp;</p>

<p align="center">
  <img alt="react-starter" src="logo.svg" width="250">
</p>

<h2 align="center">
  <big>
    <b>React Starter</b>
  </big>
</h2>

<div align="center">
  <strong>
    Create high quality React apps with minimal effort.
  </strong>
  <br />
  <br />
  <a href="http://badge.fury.io/js/jest">
    <img src="https://badge.fury.io/js/jest.svg" alt="npm version">
  </a>
  <a href="https://spectrum.chat/react-starter">
    <img src="https://withspectrum.github.io/badge/badge.svg" alt="Join the community on Spectrum">
  </a>
  <a href="https://twitter.com/intent/follow?screen_name=react_starter">
    <img src="https://img.shields.io/twitter/follow/react_starter.svg?style=social&label=Follow%20@react_starter" alt="Follow on Twitter">
  </a>
</div>

**🚀 Fast**: Fast to start and fast to develop. No tedious configuration. Just run one command and start developing features.

**👌 Convenient**: Stay up to date with latest tools and libraries (React, React Native, Webpack, ESLint, etc) without the developer overhead.

**🔓 Flexible**: No lock in. Use as much or as little of the React Starter toolset to serve your needs and eject at any time.

<p align="right"><em>See more on <a href="https://react-starter.dev">react-starter.dev</a></em></p>

## Quick Overview

```sh
npx @verumtech/react-starter my-app
cd my-app
yarn start
```

- [Creating an App](#creating-an-app) – How to create a new app.
- [User Guide](https://react-starter.dev/) – How to develop apps bootstrapped with React Starter.

React Starter works on macOS, Windows, and Linux.<br>
If something doesn’t work, please [file an issue](https://github.com/verumtech/react-starter/issues/new).<br>
If you have questions or need help, please ask in our [Spectrum](https://spectrum.chat/react-starter) community.

You **don’t** need to install or configure tools like Webpack or Babel.<br>
They are preconfigured and hidden so that you can focus on the code.

Just create a project, and you’re good to go.

## Creating an App

To create a new app, run the following command:

```sh
npx @verumtech/react-starter my-app
```

It will walk your through a prompt to select from one of the following app types:

- Single Page App (SPA) - Web app that renders in the browser only
- Isomorphic App - Web app that renders in the browser as well as the server
- Universal App - Single application that can run on iOS, Android and Web using Expo

The script will then create a directory called `my-app` inside the current folder. Inside that directory, it will generate the initial project structure and install the transitive dependencies. No configuration or complicated folder structures, just the files you need to build your app.

Once the installation is done, you can open your project folder:

```sh
cd my-app
```

Inside the newly created project, you can run some built-in commands such as:

### `npm start` or `yarn start`

Runs the app in development mode.

### `npm test` or `yarn test`

Runs the test watcher in an interactive mode.<br>
By default, runs tests related to files changed since the last commit.

## User Guide

You can find detailed instructions on using React Starter and many tips in [its documentation](https://react-starter.dev/).

## How to Update to New Versions?

Please refer to the [User Guide](https://react-starter.dev/docs/updating-to-new-releases) for this and other information.

## Contributing

We'd love to have your helping hand on `react-starter`! See [CONTRIBUTING.md](CONTRIBUTING.md) for more information on what we're looking for and how to get started.

## License

React Starter is open source software [licensed as MIT](https://github.com/verumtech/react-starter/blob/master/LICENSE).
