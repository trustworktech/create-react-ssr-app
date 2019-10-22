// @remove-on-eject-begin
/**
 * Copyright (c) 2019-present Verum Technologies
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// @remove-on-eject-end
'use strict';

const path = require('path');
const fs = require('fs-extra');
const spawn = require('@verumtech/react-dev-utils/crossSpawn');

const ownPaths = require('../config/paths');

const eslintPath = path.format({
  dir: ownPaths.ownNodeModules,
  base: '.bin/eslint',
});

const ignorePath = path.format({
  dir: ownPaths.appPath,
  base: '.gitignore',
});

// Lint code
const result = spawn.sync(
  eslintPath,
  [
    ownPaths.appPath,
    fs.existsSync(ignorePath) && '--ignore-path',
    fs.existsSync(ignorePath) && ignorePath,
    '--ext',
    '.js,.ts,.jsx,.tsx',
  ].filter(Boolean),
  { stdio: 'inherit' }
);

process.exit(result.status);
