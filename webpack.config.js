var Path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

const resolve = path => Path.resolve(__dirname, path);

module.exports = {
  context: resolve('src'),
  entry: [
    'webpack-dev-server/client?http://localhost:8080',
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
      exclude: /node_modules/,
      loaders: [{
        loader: 'react-hot-loader',
      }, {
        loader: 'babel-loader',
        options: {
          presets: ['es2015', 'react'],
        },
      }],
    }, {
      test: /\.css$/,
      loaders: ['style-loader', 'css-loader'],
    }, {
      test: /\.s[a|c]ss$/,
      loaders: ['style-loader', 'css-loader', 'sass-loader'],
    }, {
      test: /\.(png|jpe?g|gif|woff|woff2|eot|ttf|svg)$/,
      loaders: ['url-loader?limit=10000'],
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

/*
{
        loader: 'babel-loader',
        options: {presets: ['es2015', 'react']},
      }
      */