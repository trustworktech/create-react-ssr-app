/**
 * Copyright (c) 2019-present Verum Technologies
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

module.exports = function(api) {
  api.cache(true);

  return {
    presets: [
      // Expo preset
      'babel-preset-expo',
    ],
    plugins: [
      // Support for styled components
      'babel-plugin-styled-components',
    ],
  };
};
