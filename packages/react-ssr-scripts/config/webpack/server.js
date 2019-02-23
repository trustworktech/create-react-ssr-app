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
  const publicPath = isEnvProduction
    ? paths.servedPath
    : isEnvDevelopment && '/';
  const nodeArgs = ['-r', 'source-map-support/register'];
  // Passthrough --inspect and --inspect-brk flags (with optional [host:port] value) to node
  if (process.env.INSPECT_BRK) {
    nodeArgs.push(process.env.INSPECT_BRK);
  } else if (process.env.INSPECT) {
    nodeArgs.push(process.env.INSPECT);
  }

  return {
    name: 'server',
    target: 'node',
    watch: isEnvDevelopment,
    mode: isEnvProduction ? 'production' : isEnvDevelopment && 'development',
    entry: [
      isEnvDevelopment && 'webpack/hot/poll?300',
      // isEnvDevelopment &&
      //   require.resolve('react-ssr-dev-utils/formatNodeErrors'),
      paths.appServerIndexJs,
    ].filter(Boolean),
    externals: [
      nodeExternals({
        whitelist: [
          isEnvDevelopment && 'webpack/hot/poll?300',
          /\.(eot|woff|woff2|ttf|otf)$/,
          /\.(svg|png|jpg|jpeg|gif|ico)$/,
          /\.(mp4|mp3|ogg|swf|webp)$/,
          /\.(css|scss|sass|sss|less)$/,
        ].filter(Boolean),
      }),
    ],
    output: {
      path: paths.appBuild,
      publicPath: publicPath,
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
        // This is required so symlinks work during development.
        'webpack/hot/poll': require.resolve('webpack/hot/poll'),
        // Support React Native Web
        // https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
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
      new StartServerPlugin({
        name: 'index.js',
        nodeArgs,
      }),
      new webpack.WatchIgnorePlugin([paths.appBuildPublic]),
    ].filter(Boolean),
    node: {
      __console: false,
      __dirname: false,
      __filename: false,
    },
    performance: false,
  };
};
