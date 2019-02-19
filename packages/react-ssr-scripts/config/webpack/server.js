// @remove-on-eject-begin
/**
 * Copyright (c) 2019-present, Trustwork
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// @remove-on-eject-end
'use strict';

const path = require('path');
const webpack = require('webpack');
const PnpWebpackPlugin = require('pnp-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const WriteFileWebpackPlugin = require('write-file-webpack-plugin');

const paths = require('../paths');

// This is the production and development configuration for server.
module.exports = function(webpackEnv) {
  const isEnvDevelopment = webpackEnv === 'development';
  const isEnvProduction = webpackEnv === 'production';
  const { server: serverLoaders } = require('./loaders')(webpackEnv);
  const sharedPlugins = require('./plugins')(webpackEnv);

  return {
    name: 'server',
    target: 'node',
    mode: isEnvProduction ? 'production' : isEnvDevelopment && 'development',
    entry: [paths.appServerIndexJs],
    externals: [
      nodeExternals({
        // we still want imported css from external files to be bundled otherwise 3rd party packages
        // which require us to include their own css would not work properly
        whitelist: /\.css$/,
      }),
    ],
    output: {
      path: paths.appBuild,
      filename: 'index.js',
    },
    resolve: {
      modules: ['node_modules'].concat(
        process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
      ),
      extensions: paths.moduleFileExtensions
        .map(ext => `.${ext}`)
        .filter(ext => !ext.includes('ts')),
      alias: {
        'react-native': 'react-native-web',
      },
      plugins: [
        PnpWebpackPlugin,
        new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson]),
      ],
    },
    resolveLoader: {
      plugins: [PnpWebpackPlugin.moduleLoader(module)],
    },
    module: {
      strictExportPresence: true,
      rules: [
        { parser: { requireEnsure: false } },
        {
          test: /\.(js|mjs|jsx)$/,
          enforce: 'pre',
          use: [
            {
              options: {
                formatter: require.resolve(
                  'react-ssr-dev-utils/eslintFormatter'
                ),
                eslintPath: require.resolve('eslint'),
                // @remove-on-eject-begin
                baseConfig: {
                  extends: [require.resolve('eslint-config-react-app')],
                },
                ignore: false,
                useEslintrc: false,
                // @remove-on-eject-end
              },
              loader: require.resolve('eslint-loader'),
            },
          ],
          include: paths.appSrc,
        },
        {
          oneOf: serverLoaders,
        },
      ],
    },
    plugins: [
      isEnvDevelopment && new WriteFileWebpackPlugin(),
      isEnvDevelopment && new webpack.HotModuleReplacementPlugin(),
      ...sharedPlugins,
    ].filter(Boolean),
    performance: false,
  };
};
