/**
 * Copyright (c) 2019-present Verum Technologies
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

const path = require('path');
const fs = require('fs-extra');
const shelljs = require('@verumtech/react-dev-utils/shelljs');

const paths = require('../config/paths');

const eslintPath = path.format({
  dir: paths.ownNodeModules,
  base: '.bin/eslint',
});

const ignorePath = path.format({
  dir: paths.appPath,
  base: '.gitignore',
});

// Lint code
shelljs.exec(
  `${eslintPath} ${paths.appPath} ${
    fs.existsSync(ignorePath) ? `--ignore-path ${ignorePath}` : ''
  } --ext .js,.ts,.jsx,.tsx`,
  code => {
    if (code !== 0) {
      shelljs.exit(1);
    }
  }
);
