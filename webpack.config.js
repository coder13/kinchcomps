const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ENV = process.env.NODE_ENV || 'dev';

const config = module.exports = {
  context: path.resolve(__dirname, './src'),
  entry: [
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/only-dev-server',
    './app.js'
  ],
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      title: 'Fantasy Cubing',
      template: './index.html'
    }),
    new HtmlWebpackPlugin({
      filename: '404.html',
      title: 'Fantasy Cubing',
      template: './index.html'
    }),
  ],
  module: {
    rules: [{
      test: /.js$/,
      exclude: ['node_modules'],
      use: [{
        loader: 'babel-loader',
        options: {presets: ['es2015', 'react']}
      }]
    }, {
      test: /\.css$/,
      loader: 'style-loader!css-loader'
    }, {
      test: /\.styl$/,
      loader: 'style-loader!css-loader!postcss-loader!stylus-loader'
    }]
  },
  resolve: {
    modules: [
      'node_modules',
      path.resolve(__dirname, 'app')
    ],

    extensions: ['.js', '.css']
  }
};


if (ENV === 'dev') { // dev specific stuff
  config.devtool = 'eval';
  config.devServer = {
    quiet: false,
    noInfo: false,
    lazy: false,
    historyApiFallback: true,
    hot: true,
    inline: true,
    publicPath: '/',
    stats: {colors: true},
    port: 8080
  };
} else { // Produciton stuff
  config.plugins.push(
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      output: {
        comments: false
      },
      sourceMap: false
    }),
    new ExtractTextPlugin(config.output.cssFilename, {
      allChunks: true
    })
  );
}
