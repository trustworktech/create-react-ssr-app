// @remove-on-eject-begin
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// @remove-on-eject-end
'use strict';

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'test';
process.env.NODE_ENV = 'test';
process.env.PUBLIC_URL = '';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

// Ensure environment variables are read.
require('../config/env');
// @remove-on-eject-begin
const path = require('path');
const ownPaths = require('../config/paths');
const appPath = ownPaths.appPath;
const scriptPath = ownPaths.scriptPath;
require(path.join(scriptPath, 'config', 'env'));
// Do the preflight check (only happens before eject).
const verifyPackageTree = require(path.join(
  scriptPath,
  'config',
  'verifyPackageTree'
));
if (process.env.SKIP_PREFLIGHT_CHECK !== 'true') {
  verifyPackageTree();
}
const verifyTypeScriptSetup = require(path.join(
  scriptPath,
  'config',
  'verifyTypeScriptSetup'
));
verifyTypeScriptSetup();
// @remove-on-eject-end
const jest = require('jest');
const execSync = require('child_process').execSync;
let argv = process.argv.slice(2);
// @remove-on-eject-begin
// Before ejection we have a --script <script_name> flag to remove from the jest command
argv = process.argv.slice(4);
// @remove-on-eject-end
function isInGitRepository() {
  try {
    execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

function isInMercurialRepository() {
  try {
    execSync('hg --cwd . root', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

// Watch unless on CI or explicitly running all tests
if (
  !process.env.CI &&
  argv.indexOf('--watchAll') === -1 &&
  argv.indexOf('--watchAll=false') === -1
) {
  const hasSourceControl = isInGitRepository() || isInMercurialRepository();
  argv.push(hasSourceControl ? '--watch' : '--watchAll');
}

// @remove-on-eject-begin
// This is not necessary after eject because we embed config into package.json.
const createJestConfig = require(path.join(
  scriptPath,
  'config',
  'createJestConfig'
));

argv.push(
  '--config',
  JSON.stringify(
    createJestConfig(
      relativePath => path.resolve(scriptPath, relativePath),
      appPath,
      false
    )
  )
);

// This is a very dirty workaround for https://github.com/facebook/jest/issues/5913.
// We're trying to resolve the environment ourselves because Jest does it incorrectly.
// TODO: remove this as soon as it's fixed in Jest.
const resolve = require('resolve');
function resolveJestDefaultEnvironment(name) {
  const jestDir = path.dirname(
    resolve.sync('jest', {
      basedir: __dirname,
    })
  );
  const jestCLIDir = path.dirname(
    resolve.sync('jest-cli', {
      basedir: jestDir,
    })
  );
  const jestConfigDir = path.dirname(
    resolve.sync('jest-config', {
      basedir: jestCLIDir,
    })
  );
  return resolve.sync(name, {
    basedir: jestConfigDir,
  });
}
let cleanArgv = [];
let env = 'jsdom';
let next;
do {
  next = argv.shift();
  if (next === '--env') {
    env = argv.shift();
  } else if (next.indexOf('--env=') === 0) {
    env = next.substring('--env='.length);
  } else {
    cleanArgv.push(next);
  }
} while (argv.length > 0);
argv = cleanArgv;
let resolvedEnv;
try {
  resolvedEnv = resolveJestDefaultEnvironment(`jest-environment-${env}`);
} catch (e) {
  // ignore
}
if (!resolvedEnv) {
  try {
    resolvedEnv = resolveJestDefaultEnvironment(env);
  } catch (e) {
    // ignore
  }
}
const testEnvironment = resolvedEnv || env;
argv.push('--env', testEnvironment);
// @remove-on-eject-end
jest.run(argv);
