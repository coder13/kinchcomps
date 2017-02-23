var Path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

const resolve = path => Path.resolve(__dirname, path);

module.exports = {
  context: resolve('src'),
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    './app.js',
  ],

  output: {
    filename: 'bundle.js',
    path: resolve('public'),
    publicPath: '/',
  },

  module: {
    rules: [{
      test: /.js$/,
      exclude: ['node_modules'],
      use: [{
        loader: 'babel-loader',
        options: {presets: ['es2015', 'react']},
      }],
    }, {
      test: /\.css$/,
      loaders: ['style-loader', 'css-loader'],
    }, {
      test: /\.sass$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
    }],
  },

  resolve: {
    modules: [
      'node_modules',
      resolve('src'),
    ],

    extensions: ['.js', '.css', '.sass'],
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      template: resolve('./src/index.html'),
      inject: 'body',
    }),
  ],

  devtool: 'inline-source-map',

  devServer: {
    host: 'localhost',
    port: 8080,

    historyApiFallback: true,
    hot: true,
  },
};
