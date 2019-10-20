# babel-preset-react-app-spa

This package includes the Babel preset used by [React Starter](https://github.com/verumtech/react-starter) for single page apps (SPAs).<br>
Please refer to its documentation:

- [Getting Started](https://react-starter.dev/docs/getting-started) – How to create a new app.
- [User Guide](https://react-starter.dev/) – How to develop apps bootstrapped with React Starter.

## Usage in React Starter Projects

The easiest way to use this configuration is with [React Starter](https://github.com/verumtech/react-starter), which includes it by default. **You don’t need to install it separately in React Starter projects.**

## Usage Outside of React Starter

If you want to use this Babel preset in a project not built with React Starter, you can install it with the following steps.

First, [install Babel](https://babeljs.io/docs/setup/).

Then install @verumtech/babel-preset-react-app-spa.

```sh
npm install @verumtech/babel-preset-react-app-spa --save-dev
```

Then create a file named `.babelrc` with following contents in the root folder of your project:

```json
{
  "presets": ["@verumtech/react-app-spa"]
}
```

This preset uses the `useBuiltIns` option with [transform-object-rest-spread](http://babeljs.io/docs/plugins/transform-object-rest-spread/) and [transform-react-jsx](http://babeljs.io/docs/plugins/transform-react-jsx/), which assumes that `Object.assign` is available or polyfilled.

## Usage with Flow

Make sure you have a `.flowconfig` file at the root directory. You can also use the `flow` option on `.babelrc`:

```json
{
  "presets": [
    ["@verumtech/react-app-spa", { "flow": true, "typescript": false }]
  ]
}
```

## Usage with TypeScript

Make sure you have a `tsconfig.json` file at the root directory. You can also use the `typescript` option on `.babelrc`:

```json
{
  "presets": [
    ["@verumtech/react-app-spa", { "flow": false, "typescript": true }]
  ]
}
```
