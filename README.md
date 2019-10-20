# React Starter

Create high quality React apps with minimal effort.

- [Creating an App](#creating-an-app) – How to create a new app.
- [User Guide](https://react-starter.dev/) – How to develop apps bootstrapped with React Starter.

React Starter works on macOS, Windows, and Linux.<br>
If something doesn’t work, please [file an issue](https://github.com/verumtech/react-starter/issues/new).<br>
If you have questions or need help, please ask in our [Spectrum](https://spectrum.chat/react-starter) community.

## Quick Overview

```sh
npm install @verumtech/react-starter --global
react-starter init my-app
cd my-app
yarn start
```

### Get Started Immediately

You **don’t** need to install or configure tools like Webpack or Babel.<br>
They are preconfigured and hidden so that you can focus on the code.

Just create a project, and you’re good to go.

## Creating an App

To create a new app, run the following commands:

```sh
npm install @verumtech/react-starter --global
react-starter init my-app
```

It will walk your through a prompt to set preferences like **typescript vs javascript** and select from one of the following app types:

- Single Page Application (SPA) - Web app that renders in the browser only
- Isomorphic - Web app that renders in the browser as well as the server
- Universal - Single application that can run on iOS, Android and Web

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
