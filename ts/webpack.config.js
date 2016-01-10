'use strict';

const NODE_ENV = process.env.NODE_ENV || 'development';

const CompressionPlugin = require('compression-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const zlib = require('zlib');

module.exports = {
  entry: {
    'app': './src/app.ts',
    'vendor': './src/vendor.ts'
  },
  output: {
    path: './dist',
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js'),
    new webpack.NoErrorsPlugin()
  ],
  resolve: {
    extensions: ['', '.ts', '.js']
  },
  module: {
    loaders: [
      {test: /\.ts$/, loader: 'ts-loader'}
    ],
    noParse: [
      path.join(__dirname, 'node_modules', 'angular2', 'bundles')
    ]
  },
  devServer: {
    historyApiFallback: true
  },
  devtool: 'source-map'
};

if (NODE_ENV === 'production') {
  module.exports.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new CompressionPlugin({
      algorithm: gzipMaxCompression,
      regExp: /\.js$|\.html$/,
      threshold: 10 * 1024,
      minRatio: 0.8
    })
  );
}

function gzipMaxCompression(buffer, callback) {
  return zlib['gzip'](buffer, {level: 9}, callback)
}
