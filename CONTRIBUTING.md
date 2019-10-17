# Contributing to React Starter

Loving React Starter and want to get involved? Thanks! There are plenty of ways you can help.

Please take a moment to review this document in order to make the contribution process easy and effective for everyone involved.

## Submitting a Pull Request

Good pull requests, such as patches, improvements, and new features, are a fantastic help. They should remain focused in scope and avoid containing unrelated commits.

Please **ask first** if somebody else is already working on this or the core developers think your feature is in-scope for React Starter. Generally always have a related issue with discussions for whatever you are including.

Please also provide a **test plan**, i.e. specify how you verified that your addition works.

## Folder Structure of React Starter

`react-starter` is a monorepo, meaning it is divided into independent sub-packages.<br>
These packages can be found in the [`packages/`](https://github.com/verumtech/react-starter/tree/master/packages) directory.

### Overview of directory structure

```
packages/
  react-starter/
```

### Package Descriptions

#### [react-starter](https://github.com/verumtech/react-starter/tree/master/packages/react-starter)

The global CLI command code can be found in this directory. It should run on Node 8+.

## Setting Up a Local Copy

1. Clone the repo with `git clone https://github.com/verumtech/react-starter`

2. Run `yarn` in the root `react-starter` folder.

Once it is done, you can modify any file locally and run `yarn start` or `yarn test` just like in a generated project.

If you want to try out the end-to-end flow with the global CLI, you can do this too:

```sh
yarn react-starter init my-app
cd my-app
```

and then run `yarn start` or `yarn test`.
