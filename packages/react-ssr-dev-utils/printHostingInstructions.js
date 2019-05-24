/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const chalk = require('chalk');

function printHostingInstructions(assetsPath, buildFolder) {
  console.log(
    `The project was built assuming all static assets are served from the path '${chalk.green(
      assetsPath
    )}'.`
  );
  console.log();
  if (assetsPath.startsWith('/')) {
    console.log(
      'All of your static assets will be served from the rendering server.'
    );
    console.log('We recommend serving static assets from a CDN in production.');
    console.log(
      `You can control this with the ${chalk.cyan(
        'ASSETS_PATH'
      )} environment variable.`
    );
    console.log();
  }
  console.log(`The ${chalk.cyan(buildFolder)} folder is ready to be deployed.`);
  console.log();
  console.log('You may run the app with node:');
  console.log();
  console.log(` ${chalk.cyan('node')} ${buildFolder}`);
  console.log();
}

module.exports = printHostingInstructions;
