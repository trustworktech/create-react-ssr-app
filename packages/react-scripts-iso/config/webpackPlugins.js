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
const resolve = require('resolve');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StartServerPlugin = require('start-server-webpack-plugin');
const WriteFileWebpackPlugin = require('write-file-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const ModuleNotFoundPlugin = require('@verumtech/react-dev-utils/ModuleNotFoundPlugin');
const ForkTsCheckerWebpackPlugin = require('@verumtech/react-dev-utils/ForkTsCheckerWebpackPlugin');
const typescriptFormatter = require('@verumtech/react-dev-utils/typescriptFormatter');
const WatchMissingNodeModulesPlugin = require('@verumtech/react-dev-utils/WatchMissingNodeModulesPlugin');
const InlineChunkHtmlPlugin = require('@verumtech/react-dev-utils/InlineChunkHtmlPlugin');
const InterpolateHtmlPlugin = require('@verumtech/react-dev-utils/InterpolateHtmlPlugin');

const paths = require('./paths');
const getClientEnvironment = require('./env');

// Check if TypeScript is setup
const useTypeScript = fs.existsSync(paths.appTsConfig);
// Some apps do not need the benefits of saving a web request, so not inlining the chunk
// makes for a smoother build process.
const shouldInlineRuntimeChunk = process.env.INLINE_RUNTIME_CHUNK !== 'false';

module.exports = function(webpackEnv, appEnv) {
  const isEnvDevelopment = webpackEnv === 'development';
  const isEnvProduction = webpackEnv === 'production';
  const isEnvClient = appEnv === 'client';
  const isEnvServer = appEnv === 'server';
  const env = getClientEnvironment();
  const publicPath = isEnvProduction
    ? `${env.raw.ASSETS_PATH}/`
    : isEnvDevelopment && '/';
  const nodeArgs = ['-r', 'source-map-support/register'];
  // Passthrough --inspect and --inspect-brk flags (with optional [host:port] value) to node
  if (process.env.INSPECT_BRK) {
    nodeArgs.push(process.env.INSPECT_BRK);
  } else if (process.env.INSPECT) {
    nodeArgs.push(process.env.INSPECT);
  }

  return [
    // Generates an `app.html` file with the <script> injected.
    isEnvClient &&
      new HtmlWebpackPlugin(
        Object.assign(
          {},
          {
            inject: true,
            filename: 'app.html',
            template: paths.appHtml,
          },
          isEnvProduction
            ? {
                minify: {
                  removeComments: true,
                  collapseWhitespace: true,
                  removeRedundantAttributes: true,
                  useShortDoctype: true,
                  removeEmptyAttributes: true,
                  removeStyleLinkTypeAttributes: true,
                  keepClosingSlash: true,
                  minifyJS: true,
                  minifyCSS: true,
                  minifyURLs: true,
                },
              }
            : undefined
        )
      ),
    // Inlines the webpack runtime script. This script is too small to warrant
    // a network request.
    isEnvClient &&
      isEnvProduction &&
      shouldInlineRuntimeChunk &&
      new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime-.+[.]js/]),
    // Makes some environment variables available in index.html.
    // The public URL is available as %ASSETS_PATH% in index.html, e.g.:
    // <link rel="shortcut icon" href="%ASSETS_PATH%/favicon.ico">
    // In production, it will be an empty string unless you specify "homepage"
    // in `package.json`, in which case it will be the pathname of that URL.
    // In development, this will be an empty string.
    isEnvClient && new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.raw),
    // This gives some necessary context to module not found errors, such as
    // the requesting resource.
    new ModuleNotFoundPlugin(paths.appPath),
    // Makes some environment variables available to the JS code, for example:
    // if (process.env.NODE_ENV === 'production') { ... }. See `./env.js`.
    // It is absolutely essential that NODE_ENV is set to production
    // during a production build.
    // Otherwise React will be compiled in the very slow development mode.
    (isEnvClient || isEnvDevelopment) &&
      new webpack.DefinePlugin(env.stringified),
    // This is necessary to emit hot updates
    isEnvDevelopment && new WriteFileWebpackPlugin(),
    isEnvDevelopment && new webpack.HotModuleReplacementPlugin(),
    // Watcher doesn't work well if you mistype casing in a path so we use
    // a plugin that prints an error when you attempt to do this.
    // See https://github.com/facebook/create-react-app/issues/240
    isEnvDevelopment && new CaseSensitivePathsPlugin(),
    // If you require a missing module and then `npm install` it, you still have
    // to restart the development server for Webpack to discover it. This plugin
    // makes the discovery automatic so you don't have to restart.
    // See https://github.com/facebook/create-react-app/issues/186
    isEnvDevelopment && new WatchMissingNodeModulesPlugin(paths.appNodeModules),
    isEnvProduction &&
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: 'static/css/[name].[contenthash:8].css',
        chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
      }),
    // Generate an asset manifest file with the following content:
    // - "files" key: Mapping of all asset filenames to their corresponding
    //   output file so that tools can pick it up without having to parse
    //   `app.html`
    // - "entrypoints" key: Array of files which are included in `app.html`,
    //   can be used to reconstruct the HTML if necessary
    isEnvClient &&
      new ManifestPlugin({
        fileName: 'asset-manifest.json',
        publicPath: publicPath,
        generate: (seed, files, entrypoints) => {
          const manifestFiles = files.reduce((manifest, file) => {
            manifest[file.name] = file.path;
            return manifest;
          }, seed);
          const entrypointFiles = entrypoints.main.filter(
            fileName => !fileName.endsWith('.map')
          );

          return {
            files: manifestFiles,
            entrypoints: entrypointFiles,
          };
        },
      }),
    // Moment.js is an extremely popular library that bundles large locale files
    // by default due to how Webpack interprets its code. This is a practical
    // solution that requires the user to opt into importing specific locales.
    // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
    // You can remove this if you don't use Moment.js:
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    // TypeScript type checking
    useTypeScript &&
      new ForkTsCheckerWebpackPlugin({
        typescript: resolve.sync('typescript', {
          basedir: paths.appNodeModules,
        }),
        async: isEnvDevelopment,
        useTypescriptIncrementalApi: true,
        checkSyntacticErrors: true,
        resolveModuleNameModule: process.versions.pnp
          ? `${__dirname}/pnpTs.js`
          : undefined,
        resolveTypeReferenceDirectiveModule: process.versions.pnp
          ? `${__dirname}/pnpTs.js`
          : undefined,
        tsconfig: paths.appTsConfig,
        reportFiles: [
          '**',
          '!**/__tests__/**',
          '!**/?(*.)(spec|test).*',
          '!**/src/setupTests.*',
        ],
        silent: true,
        // The formatter is invoked directly in WebpackDevServerUtilsSpa during development
        formatter: isEnvProduction ? typescriptFormatter : undefined,
      }),
    isEnvServer &&
      isEnvDevelopment &&
      new StartServerPlugin({
        name: 'index.js',
        nodeArgs,
      }),
    isEnvServer &&
      isEnvDevelopment &&
      new webpack.WatchIgnorePlugin([paths.appDistPublic]),
  ].filter(Boolean);
};
