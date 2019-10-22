// @remove-on-eject-begin
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// @remove-on-eject-end
'use strict';

const path = require('path');
const fs = require('fs');

// Make sure any symlinks in the project folder are resolved
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const moduleFileExtensions = [
  'web.mjs',
  'mjs',
  'web.js',
  'js',
  'web.ts',
  'ts',
  'web.tsx',
  'tsx',
  'json',
  'web.jsx',
  'jsx',
];

// Resolve file paths in the same order as webpack
const resolveModule = (resolveFn, filePath) => {
  const extension = moduleFileExtensions.find(extension =>
    fs.existsSync(resolveFn(`${filePath}.${extension}`))
  );

  if (extension) {
    return resolveFn(`${filePath}.${extension}`);
  }

  return resolveFn(`${filePath}.js`);
};

// config after eject: we're in ./config/
module.exports = {
  dotenv: resolveApp('.env'),
  appPath: resolveApp('.'),
  appPackageJson: resolveApp('package.json'),
  appJson: resolveApp('app.json'),
  appTsConfig: resolveApp('tsconfig.json'),
  appJsConfig: resolveApp('jsconfig.json'),
  yarnLockFile: resolveApp('yarn.lock'),
  testsSetup: resolveModule(resolveApp, 'setupTests'),
  appNodeModules: resolveApp('node_modules'),
};

// @remove-on-eject-begin
const resolveOwn = relativePath => path.resolve(__dirname, '..', relativePath);

// config before eject: we're in ./node_modules/react-scripts-spa/config/
module.exports = {
  dotenv: resolveApp('.env'),
  appPath: resolveApp('.'),
  appPackageJson: resolveApp('package.json'),
  appJson: resolveApp('app.json'),
  appTsConfig: resolveApp('tsconfig.json'),
  appJsConfig: resolveApp('jsconfig.json'),
  yarnLockFile: resolveApp('yarn.lock'),
  testsSetup: resolveModule(resolveApp, 'setupTests'),
  appNodeModules: resolveApp('node_modules'),
  // These properties only exist before ejecting:
  ownPath: resolveOwn('.'),
  ownNodeModules: resolveOwn('node_modules'), // This is empty on npm 3
  appTypeDeclarations: resolveApp('react-app-env.d.ts'),
  ownTypeDeclarations: resolveOwn('lib/react-app.d.ts'),
};

const ownPackageJson = require('../package.json');
const reactScriptsPath = resolveApp(`node_modules/${ownPackageJson.name}`);
const reactScriptsLinked =
  fs.existsSync(reactScriptsPath) &&
  fs.lstatSync(reactScriptsPath).isSymbolicLink();

// config before publish: we're in ./packages/react-scripts-uni/config/
if (
  !reactScriptsLinked &&
  __dirname.indexOf(path.join('packages', 'react-scripts-uni', 'config')) !== -1
) {
  module.exports = {
    dotenv: resolveOwn('template/.env'),
    appPath: resolveOwn('template/'),
    appPackageJson: resolveOwn('package.json'),
    appJson: resolveOwn('template/app.json'),
    appTsConfig: resolveOwn('template/tsconfig.json'),
    appJsConfig: resolveOwn('template/jsconfig.json'),
    yarnLockFile: resolveOwn('template/yarn.lock'),
    testsSetup: resolveModule(resolveOwn, 'template/setupTests'),
    appNodeModules: resolveOwn('node_modules'),
    // These properties only exist before ejecting:
    ownPath: resolveOwn('.'),
    ownNodeModules: resolveOwn('node_modules'),
    appTypeDeclarations: resolveOwn('template/react-app-env.d.ts'),
    ownTypeDeclarations: resolveOwn('lib/react-app.d.ts'),
  };
}
// @remove-on-eject-end

module.exports.moduleFileExtensions = moduleFileExtensions;
