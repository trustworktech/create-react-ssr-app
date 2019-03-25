---
id: deployment
title: Deployment
sidebar_label: Deployment
---

`npm run build` creates a `build` directory with a production build of your app. This includes an `index.js` file for the server code and a `public` folder containing the client code. To run the build you can simply use run the node script with `NODE_ENV=production node build`. For more information see the [production build](production-build.md) section.

## Node Server

For environments using [Node](https://nodejs.org/), the easiest way to handle this would be to install [forever](https://github.com/foreverjs/forever) and let it handle the rest:

```sh
npm install -g forever
forever start build
```

Run this command to get a full list of the options available:

```sh
forever --help
```

## Other Solutions

You need a node server in order to run a Create React SSR App project in production. Where you choose to host that
node server is up to you. A simple solution you can use is Heroku. Follow the steps [here](https://devcenter.heroku.com/articles/getting-started-with-nodejs) for information how to get started.

## Customizing Environment Variables for Arbitrary Build Environments

You can create an arbitrary build environment by creating a custom `.env` file and loading it using [env-cmd](https://www.npmjs.com/package/env-cmd).

For example, to create a build environment for a staging environment:

1. Create a file called `.env.staging`
1. Set environment variables as you would any other `.env` file (e.g. `REACT_APP_API_URL=http://api-staging.example.com`)
1. Install [env-cmd](https://www.npmjs.com/package/env-cmd)
   ```sh
   $ npm install env-cmd --save
   $ # or
   $ yarn add env-cmd
   ```
1. Add a new script to your `package.json`, building with your new environment:
   ```json
   {
     "scripts": {
       "build:staging": "env-cmd .env.staging npm run build"
     }
   }
   ```

Now you can run `npm run build:staging` to build with the staging environment config.
You can specify other environments in the same way.

Variables in `.env.production` will be used as fallback because `NODE_ENV` will always be set to `production` for a build.
