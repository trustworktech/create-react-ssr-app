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
const StartServerPlugin = require('start-server-webpack-plugin');
const ModuleScopePlugin = require('react-ssr-dev-utils/ModuleScopePlugin');

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
    watch: isEnvDevelopment,
    mode: isEnvProduction ? 'production' : isEnvDevelopment && 'development',
    entry: {
      server: [paths.appServerIndexJs],
    },
    externals: [
      nodeExternals({
        whitelist: [
          /\.(eot|woff|woff2|ttf|otf)$/,
          /\.(svg|png|jpg|jpeg|gif|ico)$/,
          /\.(mp4|mp3|ogg|swf|webp)$/,
          /\.(css|scss|sass|sss|less)$/,
        ],
      }),
    ],
    output: {
      path: paths.appBuild,
      publicPath: paths.appBuildPublic,
      filename: 'index.js',
      libraryTarget: 'commonjs2',
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
      ...sharedPlugins,
      isEnvDevelopment &&
        new StartServerPlugin({
          name: 'server.js',
          nodeArgs: ['-r', 'source-map-support/register'],
        }),
      // Ignore assets.json to avoid infinite recompile bug
      isEnvDevelopment && new webpack.WatchIgnorePlugin([paths.appBuildPublic]),
    ].filter(Boolean),
    node: {
      __console: false,
      __dirname: false,
      __filename: false,
    },
    performance: false,
  };
};
