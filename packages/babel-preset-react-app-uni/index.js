/**
 * Copyright (c) 2019-present Verum Technologies
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

const create = require('./create');

module.exports = function(api, opts) {
  const env = process.env.BABEL_ENV || process.env.NODE_ENV;
  return create(api, opts, env);
};
