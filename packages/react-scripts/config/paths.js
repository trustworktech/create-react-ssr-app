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
const commander = require('@verumtech/react-dev-utils/commander');

const validScriptOptions = [
  'react-scripts-spa',
  'react-scripts-iso',
  'react-scripts-uni',
];

const program = new commander.Command()
  .option('-s, --script [name]', 'The react-scripts name to use')
  .allowUnknownOption()
  .parse(process.argv);

if (!program.script || !validScriptOptions.includes(program.script)) {
  console.error(
    `Must select a valid script name using --script option. Valid choices are: ${validScriptOptions.join(
      ', '
    )}`
  );
  process.exit(1);
}

// Make sure any symlinks in the project folder are resolved
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
const resolveOwn = relativePath => path.resolve(__dirname, '..', relativePath);
const resolveScript = relativePath =>
  path.resolve(__dirname, '..', '..', program.script, relativePath);

// we're in ./node_modules/react-scripts/config/
module.exports = {
  appPath: resolveApp('.'),
  appNodeModules: resolveApp('node_modules'),
  ownPath: resolveOwn('.'),
  ownNodeModules: resolveOwn('node_modules'),
  scriptName: program.script,
  scriptPath: resolveScript('.'),
  scriptNodeModules: resolveScript('node_modules'),
};

const ownPackageJson = require('../package.json');
const reactScriptsPath = resolveApp(`node_modules/${ownPackageJson.name}`);
const reactScriptsLinked =
  fs.existsSync(reactScriptsPath) &&
  fs.lstatSync(reactScriptsPath).isSymbolicLink();

// we're in ./packages/react-scripts/config/
if (
  !reactScriptsLinked &&
  __dirname.indexOf(path.join('packages', 'react-scripts', 'config')) !== -1
) {
  module.exports = {
    appPath: resolveOwn('.'),
    appNodeModules: resolveOwn('node_modules'),
    ownPath: resolveOwn('.'),
    ownNodeModules: resolveOwn('node_modules'),
    scriptName: program.script,
    scriptPath: resolveScript('.'),
    scriptNodeModules: resolveScript('node_modules'),
  };
}
