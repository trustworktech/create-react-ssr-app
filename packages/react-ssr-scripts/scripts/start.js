// @remove-on-eject-begin
/**
 * Copyright (c) 2019-present, Trustwork
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// @remove-on-eject-end
'use strict';

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';
// Capture any --inspect or --inspect-brk flags (with optional values) so that we
// can pass them when we invoke nodejs
process.env.INSPECT_BRK =
  process.argv.find(arg => arg.match(/--inspect-brk(=|$)/)) || '';
process.env.INSPECT =
  process.argv.find(arg => arg.match(/--inspect(=|$)/)) || '';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

// Ensure environment variables are read.
require('../config/env');
// @remove-on-eject-begin
// Do the preflight check (only happens before eject).
const verifyPackageTree = require('./utils/verifyPackageTree');
if (process.env.SKIP_PREFLIGHT_CHECK !== 'true') {
  verifyPackageTree();
}
// @remove-on-eject-end
const fs = require('fs-extra');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const chalk = require('react-ssr-dev-utils/chalk');
const openBrowser = require('react-ssr-dev-utils/openBrowser');
const clearConsole = require('react-ssr-dev-utils/clearConsole');
const checkRequiredFiles = require('react-ssr-dev-utils/checkRequiredFiles');
const {
  choosePort,
  prepareUrls,
  printInstructions,
  createCompiler,
} = require('react-ssr-dev-utils/webpackUtils');

const paths = require('../config/paths');
const configFactory = require('../config/webpack');
const createDevServerConfig = require('../config/webpack/wds');

const useYarn = fs.existsSync(paths.yarnLockFile);
const isInteractive = process.stdout.isTTY;

// Warn and crash if required files are missing
if (
  !checkRequiredFiles([
    paths.appHtml,
    paths.appClientIndexJs,
    paths.appServerIndexJs,
  ])
) {
  process.exit(1);
}

// Tools like Cloud9 rely on this.
const HOST = process.env.HOST || '0.0.0.0';
const appName = require(paths.appPackageJson).name;
let appPort = parseInt(process.env.PORT, 10) || 8000;
let appUrls;
let devPort = parseInt(process.env.DEV_PORT, 10) || 8080;
let devUrls;

if (process.env.HOST) {
  console.log(
    chalk.cyan(
      `Attempting to bind to HOST environment variable: ${chalk.yellow(
        chalk.bold(process.env.HOST)
      )}`
    )
  );
  console.log(
    `If this was unintentional, check that you haven't mistakenly set it in your shell.`
  );
  console.log(
    `Learn more here: ${chalk.yellow('http://bit.ly/CRA-advanced-config')}`
  );
  console.log();
}

// We require that you explictly set browsers and do not fall back to
// browserslist defaults.
const { checkBrowsers } = require('react-ssr-dev-utils/browsersHelper');
checkBrowsers(paths.appPath, isInteractive)
  .then(() => {
    // Remove all content but keep the directory so that
    // if you're in it, you don't end up in Trash
    fs.emptyDirSync(paths.appDist);
    // Merge with the public folder
    copyPublicFolder();
    // Choose port for app server
    return choosePort(HOST, appPort, 'app server');
  })
  .then(port => {
    if (port == null) {
      // We have not found a port.
      return;
    }
    appPort = port;
    process.env.PORT = appPort;
    appUrls = prepareUrls(HOST, appPort);
    // Choose port for dev server
    return choosePort(HOST, devPort, 'dev server');
  })
  .then(port => {
    if (port == null) {
      return;
    }
    devPort = port;
    process.env.DEV_PORT = devPort;
    devUrls = prepareUrls(HOST, devPort);
    // Generate configuration
    const [clientConfig, serverConfig] = configFactory('development');

    clientConfig.entry = [
      `react-ssr-dev-utils/webpackHotDevClient?devPort=${devPort}`,
      ...clientConfig.entry,
    ];
    clientConfig.output.publicPath = [
      `http://localhost:${devPort}`,
      clientConfig.output.publicPath,
    ]
      .join('/')
      .replace(/([^:+])\/+/g, '$1/');
    serverConfig.output.publicPath = [
      `http://localhost:${devPort}`,
      serverConfig.output.publicPath,
    ]
      .join('/')
      .replace(/([^:+])\/+/g, '$1/');

    // Create a webpack compiler for the client and server that is configured with custom messages.
    const clientCompiler = createCompiler(
      webpack,
      clientConfig,
      'Client',
      true
    );
    const serverCompiler = createCompiler(
      webpack,
      serverConfig,
      'Server',
      false
    );

    // Start our server webpack instance in watch mode after assets compile
    let clientStarted;
    clientCompiler.plugin('done', () => {
      if (!clientStarted) {
        clientStarted = true;
        serverCompiler.watch(
          {
            quiet: true,
            stats: 'none',
          },
          /* eslint-disable no-unused-vars */
          stats => {}
        );
      }
    });

    // Open app in browser when ready
    let serverStarted;
    serverCompiler.plugin('done', () => {
      if (!serverStarted) {
        serverStarted = true;
        setTimeout(() => {
          printInstructions(appName, appUrls, useYarn);
          openBrowser(appUrls.localUrlForBrowser);
        }, 1000);
      }
    });

    // Serve webpack assets generated by the compiler over a web server.
    const devServerConfig = createDevServerConfig(devUrls.lanUrlForConfig);
    const devServer = new WebpackDevServer(clientCompiler, devServerConfig);
    // Launch WebpackDevServer.
    devServer.listen(devPort, HOST, err => {
      if (err) {
        return console.log(err);
      }
      if (isInteractive) {
        clearConsole();
      }
      console.log(chalk.cyan('Starting the development environment...\n'));
    });

    ['SIGINT', 'SIGTERM'].forEach(function(sig) {
      process.on(sig, function() {
        devServer.close();
        process.exit();
      });
    });
  })
  .catch(err => {
    if (err && err.message) {
      console.log(err.message);
    }
    process.exit(1);
  });

function copyPublicFolder() {
  fs.copySync(paths.appPublic, paths.appDistPublic, {
    dereference: true,
    filter: file => file !== paths.appHtml,
  });
}
