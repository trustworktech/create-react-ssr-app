---
id: adding-typescript
title: Adding TypeScript
---

[TypeScript](https://www.typescriptlang.org/) is a typed superset of JavaScript that compiles to plain JavaScript.

To start a new Create React SSR App project with [TypeScript](https://www.typescriptlang.org/), you can run:

```sh
npx create-react-ssr-app my-app --typescript

# or

yarn create react-ssr-app my-app --typescript
```

> If you've previously installed `create-react-ssr-app` globally via `npm install -g create-react-ssr-app`, we recommend you uninstall the package using `npm uninstall -g create-react-ssr-app` to ensure that `npx` always uses the latest version.

To add [TypeScript](https://www.typescriptlang.org/) to a Create React SSR App project, first install it:

```sh
npm install --save typescript @types/express @types/jest @types/node @types/react @types/react-dom @types/webpack-env

# or

yarn add typescript @types/express @types/jest  @types/node @types/react @types/react-dom @types/webpack-env
```

Next, rename any file to be a TypeScript file (e.g. `src/index.js` to `src/index.tsx`) and **restart your development server**!

Type errors will show up in the same console as the build one.

To learn more about TypeScript, check out [its documentation](https://www.typescriptlang.org/).

> **Note:** If your project is not created with TypeScript enabled, npx may be using a cached version of `create-react-ssr-app`.
> Remove previously installed versions with `npm uninstall -g create-react-ssr-app`.

> **Note:** You are not required to make a [`tsconfig.json` file](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html), one will be made for you.
> You are allowed to edit the generated TypeScript configuration.

> **Note:** We recommend using [VSCode](https://code.visualstudio.com/) for a better integrated experience.

> **Note:** Constant enums and namespaces are not supported.
