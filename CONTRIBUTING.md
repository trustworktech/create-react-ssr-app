# Contributing to Create React SSR App

Loving Create React SSR App and want to get involved? Thanks! There are plenty of ways you can help.

Please take a moment to review this document in order to make the contribution process easy and effective for everyone involved.

## Submitting a Pull Request

Good pull requests, such as patches, improvements, and new features, are a fantastic help. They should remain focused in scope and avoid containing unrelated commits.

Please **ask first** if somebody else is already working on this or the core developers think your feature is in-scope for Create React App. Generally always have a related issue with discussions for whatever you are including.

Please also provide a **test plan**, i.e. specify how you verified that your addition works.

## Folder Structure of Create React App

`create-react-ssr-app` is a monorepo, meaning it is divided into independent sub-packages.<br>
These packages can be found in the [`packages/`](https://github.com/trustworktech/create-react-ssr-app/tree/master/packages) directory.

### Overview of directory structure

```
packages/
  create-react-ssr-app/
  react-ssr-dev-utils/
  react-ssr-scripts/
```

### Package Descriptions

#### [create-react-ssr-app](https://github.com/trustworktech/create-react-ssr-app/tree/master/packages/create-react-ssr-app)

The global CLI command code can be found in this directory, and shouldn't often be changed. It should run on Node 8+.

#### [react-ssr-dev-utils](https://github.com/trustworktech/create-react-ssr-app/tree/master/packages/react-ssr-dev-utils)

This package contains utilities used for `react-ssr-scripts` and sister packages.<br>
Its main purpose is to conceal code which the user shouldn't be burdened with upon ejecting.

#### [react-ssr-scripts](https://github.com/trustworktech/create-react-ssr-app/tree/master/packages/react-ssr-scripts)

This package is the heart of the project, which contains the scripts for setting up the development server, building production builds, configuring all software used, etc.<br>
All functionality must be retained (and configuration given to the user) if they choose to eject.

## Setting Up a Local Copy

1. Clone the repo with `git clone https://github.com/trustworktech/create-react-ssr-app`

2. Run `yarn` in the root `create-react-ssr-app` folder.

Once it is done, you can modify any file locally and run `yarn start`, `yarn test` or `yarn build` just like in a generated project.

If you want to try out the end-to-end flow with the global CLI, you can do this too:

```sh
yarn create-react-ssr-app my-app
cd my-app
```

and then run `yarn start` or `yarn build`.
