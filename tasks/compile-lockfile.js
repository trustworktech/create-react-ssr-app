#!/usr/bin/env node

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const cprocess = require('child_process');
const fse = require('fs-extra');
const os = require('os');
const path = require('path');

const temp = path.join(os.tmpdir(), `crsa-compile-lockfile`);

try {
  fse.removeSync(temp);
  fse.mkdirSync(temp);
  fse.writeFileSync(path.join(temp, 'package.json'), '{}');
  const dependencies = require('react-ssr-scripts/package.json').dependencies;
  const descriptors = Object.keys(dependencies).map(
    dep => `${dep}@${dependencies[dep]}`
  );
  cprocess.execFileSync('yarn', ['add', ...descriptors], { cwd: temp });
  fse.copySync(
    path.join(temp, 'yarn.lock'),
    path.join(
      __dirname,
      '..',
      'packages',
      'create-react-ssr-app',
      'yarn.lock.cached'
    )
  );
} finally {
  fse.removeSync(temp);
}
