const Path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DEV = process.env.NODE_ENV === 'dev';

const resolve = path => Path.resolve(__dirname, path);

const loaders = {
  reactHot: {
    loader: 'react-hot-loader',
  },
  babel: {
    loader: 'babel-loader',
    options: {
      presets: ['es2015', 'react'],
    },
  },
};

module.exports = {
  context: resolve('src'),
  entry: DEV ? [
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/only-dev-server',
    './app.js',
  ] : './app.js',

  output: {
    filename: 'bundle.js',
    path: resolve('public'),
    publicPath: '/',
  },

  module: {
    rules: [{
      test: /.js$/,
      exclude: /node_modules/,
      loaders: DEV ? [loaders.reactHot, loaders.babel] : [loaders.babel],
    }, {
      test: /\.css$/,
      loaders: ['style-loader', 'css-loader'],
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

    extensions: ['.js', '.css'],
  },

  plugins: [
    DEV ? new webpack.HotModuleReplacementPlugin() : null,
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      template: resolve('./src/index.html'),
      inject: 'body',
    }),
    new HtmlWebpackPlugin({
      filename: '404.html',
      template: resolve('./src/index.html'),
      inject: 'body',
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: DEV,
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(DEV ? 'development' : 'production'),
      },
    }),
  ].filter(p => !!p),

  devtool: DEV ? 'inline-source-map' : 'cheap-module-source-map',

  devServer: {
    host: 'localhost',
    port: 8080,

    historyApiFallback: true,
    hot: true,
  },
};
