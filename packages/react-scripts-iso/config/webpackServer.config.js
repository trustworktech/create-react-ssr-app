// @remove-on-eject-begin
/**
 * Copyright (c) 2019-present Verum Technologies
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// @remove-on-eject-end
'use strict';

const fs = require('fs');
const PnpWebpackPlugin = require('pnp-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const ModuleScopePlugin = require('@verumtech/react-dev-utils/ModuleScopePlugin');

const paths = require('./paths');
const modules = require('./modules');
const getClientEnvironment = require('./env');

// Check if TypeScript is setup
const useTypeScript = fs.existsSync(paths.appTsConfig);

// This is the production and development configuration for server.
module.exports = function(webpackEnv) {
  const isEnvDevelopment = webpackEnv === 'development';
  const isEnvProduction = webpackEnv === 'production';
  const { server: serverLoaders } = require('./webpackLoaders')(
    webpackEnv,
    'server'
  );
  const serverPlugins = require('./webpackPlugins')(webpackEnv, 'server');
  const env = getClientEnvironment();
  const publicPath = isEnvProduction
    ? `${env.raw.ASSETS_PATH}/`
    : isEnvDevelopment && '/';

  return {
    name: 'server',
    target: 'node',
    watch: isEnvDevelopment,
    mode: isEnvProduction ? 'production' : isEnvDevelopment && 'development',
    entry: [
      isEnvDevelopment && 'webpack/hot/poll?100',
      paths.appServerIndexJs,
    ].filter(Boolean),
    externals: [
      nodeExternals({
        whitelist: [
          isEnvDevelopment && 'webpack/hot/poll?100',
          /\.(eot|woff|woff2|ttf|otf)$/,
          /\.(svg|png|jpg|jpeg|gif|ico)$/,
          /\.(mp4|mp3|ogg|swf|webp)$/,
          /\.(css|scss|sass|sss|less)$/,
        ].filter(Boolean),
      }),
    ],
    output: {
      path: isEnvDevelopment ? paths.appDist : paths.appBuild,
      publicPath: publicPath,
      filename: 'index.js',
      libraryTarget: 'commonjs2',
    },
    resolve: {
      modules: ['node_modules', paths.appNodeModules].concat(
        modules.additionalModulePaths || []
      ),
      extensions: paths.moduleFileExtensions
        .map(ext => `.${ext}`)
        .filter(ext => useTypeScript || !ext.includes('ts')),
      alias: {
        // This is required so symlinks work during development.
        'webpack/hot/poll': require.resolve('webpack/hot/poll'),
        // Support React Native Web
        // https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
        'react-native': 'react-native-web',
        ...(modules.webpackAliases || {}),
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
          oneOf: serverLoaders,
        },
      ],
    },
    plugins: serverPlugins,
    node: {
      __console: false,
      __dirname: false,
      __filename: false,
    },
    performance: false,
  };
};
