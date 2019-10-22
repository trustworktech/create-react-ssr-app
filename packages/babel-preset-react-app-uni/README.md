# babel-preset-react-app-uni

This package includes the Babel preset used by [React Starter](https://github.com/verumtech/react-starter) for universal apps.<br>
Please refer to its documentation:

- [Getting Started](https://react-starter.dev/docs/getting-started) – How to create a new app.
- [User Guide](https://react-starter.dev/) – How to develop apps bootstrapped with React Starter.

## Usage in React Starter Projects

The easiest way to use this configuration is with [React Starter](https://github.com/verumtech/react-starter), which includes it by default. **You don’t need to install it separately in React Starter projects.**

## Usage Outside of React Starter

If you want to use this Babel preset in a project not built with React Starter, you can install it with the following steps.

First, [install Babel](https://babeljs.io/docs/setup/).

Then install @verumtech/babel-preset-react-app-uni.

```sh
npm install @verumtech/babel-preset-react-app-uni --save-dev
```

Then create a file named `.babelrc` with following contents in the root folder of your project:

```json
{
  "presets": ["@verumtech/react-app-uni"]
}
```
