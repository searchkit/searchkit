var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool:"inline-source-map",
  entry: {
    "tests": ['./webpack.tests.js'],
    "bundle": ['./src/index.ts']
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
  },
  resolve: {
    extensions:[".js", ".ts", ".tsx", ".webpack.js", ".web.js"],
    alias: {
      sinon: 'sinon/pkg/sinon',
      'react-addons-test-utils':'react-dom/test-utils'
    }
  },
  externals: {
    jsdom: 'window',
    cheerio: 'window',
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': 'window',
    'text-encoding': 'window',
    'react/addons': true

  },
  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        loaders: ['ts-loader'],
        include: path.join(__dirname, "src")
      },
      { test: /\.json$/, loader: 'json-loader' },
      {
        test: /\.scss$/,
        loaders: ['null-loader'],
        include: path.join(__dirname, 'src')
      },
      {
        test: /sinon\.js$/,
        loader: 'imports-loader?define=>false,require=>false'
      },
      {
        test: /\.(jpg|png|svg)$/,
        loaders: ['null-loader'],
        include: path.join(__dirname, 'src')
      }
    ],
  },
  node: { 
    fs: 'empty' 
  }

};
