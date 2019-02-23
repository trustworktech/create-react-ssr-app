/**
 * Copyright (c) 2019-present, Trustwork
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

const chalk = require('chalk');
const url = require('url');

function printHostingInstructions(
  appPackage,
  publicUrl,
  publicPath,
  buildFolder
) {
  if (publicUrl && publicUrl.includes('.github.io/')) {
    // "homepage": "http://user.github.io/project"
    const publicPathname = url.parse(publicPath).pathname;
    printBaseMessage(buildFolder, publicPathname);
  } else if (publicPath !== '/') {
    // "homepage": "http://mywebsite.com/project"
    printBaseMessage(buildFolder, publicPath);
  } else {
    // "homepage": "http://mywebsite.com"
    //   or no homepage
    printBaseMessage(buildFolder, publicUrl);

    printServerInstructions(buildFolder);
  }
  console.log();
  console.log('Find out more about deployment here:');
  console.log();
  console.log(`  ${chalk.yellow('http://bit.ly/CRA-deploy')}`);
  console.log();
}

function printBaseMessage(buildFolder, hostingLocation) {
  console.log(
    `The project was built assuming it is hosted at ${chalk.green(
      hostingLocation || 'the server root'
    )}.`
  );
  console.log(
    `You can control this with the ${chalk.green(
      'homepage'
    )} field in your ${chalk.cyan('package.json')}.`
  );

  if (!hostingLocation) {
    console.log('For example:');
    console.log();

    console.log(
      `  ${chalk.green('"homepage"')} ${chalk.cyan(':')} ${chalk.green(
        '"http://myappname.com/myapp"'
      )}${chalk.cyan(',')}`
    );
  }
  console.log();
  console.log(`The ${chalk.cyan(buildFolder)} folder is ready to be deployed.`);
}

function printServerInstructions(buildFolder) {
  console.log('You may run the app with node:');
  console.log();
  console.log(` ${chalk.cyan('node')} ${buildFolder}`);
}

module.exports = printHostingInstructions;
