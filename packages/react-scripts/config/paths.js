// @remove-file-on-eject
/**
 * Copyright (c) 2019-present Verum Technologies
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

const path = require('path');
const fs = require('fs');

// Make sure any symlinks in the project folder are resolved
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
const resolveOwn = relativePath => path.resolve(__dirname, '..', relativePath);

// we're in ./node_modules/react-scripts/config/
module.exports = {
  appPath: resolveApp('.'),
  appPackageJson: resolveApp('package.json'),
  appNodeModules: resolveApp('node_modules'),
  appTypeDeclarations: resolveApp('src/react-app-env.d.ts'),
  yarnLockFile: resolveApp('yarn.lock'),
  ownPath: resolveOwn('.'),
  ownNodeModules: resolveOwn('node_modules'),
};

const ownPackageJson = require('../package.json');
const reactScriptsPath = resolveApp(`node_modules/${ownPackageJson.name}`);
const reactScriptsLinked =
  fs.existsSync(reactScriptsPath) &&
  fs.lstatSync(reactScriptsPath).isSymbolicLink();

// we're in ./packages/react-scripts-spa/config/
if (
  !reactScriptsLinked &&
  __dirname.indexOf(path.join('packages', 'react-scripts', 'config')) !== -1
) {
  module.exports = {
    appPath: resolveApp('.'),
    appPackageJson: resolveOwn('package.json'),
    appNodeModules: resolveOwn('node_modules'),
    appTypeDeclarations: resolveOwn('template/src/react-app-env.d.ts'),
    yarnLockFile: resolveOwn('template/yarn.lock'),
    ownPath: resolveOwn('.'),
    ownNodeModules: resolveOwn('node_modules'),
  };
}
