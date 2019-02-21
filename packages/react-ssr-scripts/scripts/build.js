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
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

// Ensure environment variables are read.
require('../config/env');
// @remove-on-eject-begin
// Do the preflight checks (only happens before eject).
const verifyPackageTree = require('./utils/verifyPackageTree');
if (process.env.SKIP_PREFLIGHT_CHECK !== 'true') {
  verifyPackageTree();
}
// @remove-on-eject-end

const bfj = require('bfj');
const path = require('path');
const fs = require('fs-extra');
const webpack = require('webpack');
const chalk = require('react-ssr-dev-utils/chalk');
const checkRequiredFiles = require('react-ssr-dev-utils/checkRequiredFiles');
const FileSizeReporter = require('react-ssr-dev-utils/FileSizeReporter');
const formatWebpackMessages = require('react-ssr-dev-utils/formatWebpackMessages');
const printBuildError = require('react-ssr-dev-utils/printBuildError');
const printHostingInstructions = require('react-ssr-dev-utils/printHostingInstructions');

const paths = require('../config/paths');
const configFactory = require('../config/webpack');

const measureFileSizesBeforeBuild =
  FileSizeReporter.measureFileSizesBeforeBuild;
const printFileSizesAfterBuild = FileSizeReporter.printFileSizesAfterBuild;
const useYarn = fs.existsSync(paths.yarnLockFile);

// These sizes are pretty large. We'll warn for bundles exceeding them.
const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;

const isInteractive = process.stdout.isTTY;

// Warn and crash if required files are missing
if (!checkRequiredFiles([paths.appClientIndexJs, paths.appServerIndexJs])) {
  process.exit(1);
}

// Process CLI arguments
const argv = process.argv.slice(2);
const writeStatsJson = argv.indexOf('--stats') !== -1;

// Generate configuration
const [clientConfig, serverConfig] = configFactory('production');

// We require that you explicitly set browsers and do not fall back to
// browserslist defaults.
const { checkBrowsers } = require('react-ssr-dev-utils/browsersHelper');
checkBrowsers(paths.appPath, isInteractive)
  .then(() => {
    // First, read the current file sizes in client build directory.
    // This lets us display how much they changed later.
    return measureFileSizesBeforeBuild(paths.appBuildPublic);
  })
  .then(previousFileSizes => {
    // Remove all content but keep the directory so that
    // if you're in it, you don't end up in Trash
    fs.emptyDirSync(paths.appBuild);
    // Merge with the public folder
    copyPublicFolder();
    // Start the webpack build
    return build(previousFileSizes);
  })
  .then(
    ({ stats, previousFileSizes, warnings }) => {
      if (warnings.length) {
        console.log(chalk.yellow('Compiled with warnings.\n'));
        console.log(warnings.join('\n\n'));
        console.log(
          '\nSearch for the ' +
            chalk.underline(chalk.yellow('keywords')) +
            ' to learn more about each warning.'
        );
        console.log(
          'To ignore, add ' +
            chalk.cyan('// eslint-disable-next-line') +
            ' to the line before.\n'
        );
      } else {
        console.log(chalk.green('Compiled successfully.\n'));
      }

      console.log('File sizes after gzip:\n');
      printFileSizesAfterBuild(
        stats,
        previousFileSizes,
        paths.appBuild,
        WARN_AFTER_BUNDLE_GZIP_SIZE,
        WARN_AFTER_CHUNK_GZIP_SIZE
      );
      console.log();

      const appPackage = require(paths.appPackageJson);
      const publicUrl = paths.publicUrl;
      const publicPath = clientConfig.output.publicPath;
      const buildFolder = path.relative(process.cwd(), paths.appBuild);
      printHostingInstructions(
        appPackage,
        publicUrl,
        publicPath,
        buildFolder,
        useYarn
      );
    },
    err => {
      console.log(chalk.red('Failed to compile.\n'));
      printBuildError(err);
      process.exit(1);
    }
  )
  .catch(err => {
    if (err && err.message) {
      console.log(err.message);
    }
    process.exit(1);
  });

// Create the production build for client and server and print the deployment instructions.
function build(previousFileSizes) {
  console.log('Creating an optimized production build...');
  const clientCompiler = webpack(clientConfig);
  const serverCompiler = webpack(serverConfig);

  console.log('Compiling client...');
  return new Promise((resolve, reject) => {
    clientCompiler.run((clientErr, clientStats) => {
      let clientMessages;
      if (clientErr) {
        if (!clientErr.message) {
          return reject(clientErr);
        }
        clientMessages = formatWebpackMessages({
          errors: [clientErr.message],
          warnings: [],
        });
      } else {
        clientMessages = formatWebpackMessages(
          clientStats.toJson({ all: false, warnings: true, errors: true })
        );
      }
      if (clientMessages.errors.length) {
        // Only keep the first error. Others are often indicative
        // of the same problem, but confuse the reader with noise.
        if (clientMessages.errors.length > 1) {
          clientMessages.errors.length = 1;
        }
        return reject(new Error(clientMessages.errors.join('\n\n')));
      }
      if (
        process.env.CI &&
        (typeof process.env.CI !== 'string' ||
          process.env.CI.toLowerCase() !== 'false') &&
        clientMessages.warnings.length
      ) {
        console.log(
          chalk.yellow(
            '\nTreating warnings as errors because process.env.CI = true.\n' +
              'Most CI servers set it automatically.\n'
          )
        );
        return reject(new Error(clientMessages.warnings.join('\n\n')));
      }
      console.log(chalk.green('Compiled client successfully.'));

      console.log('Compiling server...');
      serverCompiler.run((serverErr, serverStats) => {
        let serverMessages;
        if (serverErr) {
          if (!serverErr.message) {
            return reject(serverErr);
          }
          serverMessages = formatWebpackMessages({
            errors: [serverErr.message],
            warnings: [],
          });
        } else {
          serverMessages = formatWebpackMessages(
            serverStats.toJson({ all: false, warnings: true, errors: true })
          );
        }
        if (serverMessages.errors.length) {
          if (serverMessages.errors.length > 1) {
            serverMessages.errors.length = 1;
          }
          return reject(new Error(serverMessages.errors.join('\n\n')));
        }
        if (
          process.env.CI &&
          (typeof process.env.CI !== 'string' ||
            process.env.CI.toLowerCase() !== 'false') &&
          serverMessages.warnings.length
        ) {
          console.log(
            chalk.yellow(
              '\nTreating warnings as errors because process.env.CI = true.\n' +
                'Most CI servers set it automatically.\n'
            )
          );
          return reject(new Error(serverMessages.warnings.join('\n\n')));
        }
        console.log(chalk.green('Compiled server successfully.'));

        const resolveArgs = {
          stats: clientStats,
          previousFileSizes,
          warnings: Object.assign(
            {},
            clientMessages.warnings,
            serverMessages.warnings
          ),
        };
        if (writeStatsJson) {
          return bfj
            .write(paths.appBuild + '/bundle-stats.json', clientStats.toJson())
            .then(() => resolve(resolveArgs))
            .catch(error => reject(new Error(error)));
        }

        return resolve(resolveArgs);
      });
    });
  });
}

function copyPublicFolder() {
  fs.copySync(paths.appPublic, paths.appBuildPublic, {
    dereference: true,
  });
}
