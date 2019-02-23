/**
 * Copyright (c) 2019-present, Trustwork
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

const path = require('path');
const escape = require('escape-string-regexp');

module.exports = function ignoredFiles(appSrc) {
  return new RegExp(
    `^(?!${escape(
      path.normalize(appSrc + '/').replace(/[\\]+/g, '/')
    )}).+/node_modules/`,
    'g'
  );
};
