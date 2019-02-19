// @remove-on-eject-begin
/**
 * Copyright (c) 2019-present, Trustwork
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// @remove-on-eject-end
'use strict';

module.exports = (webpackEnv = 'production') => {
  return [require('./client')(webpackEnv), require('./server')(webpackEnv)];
};
