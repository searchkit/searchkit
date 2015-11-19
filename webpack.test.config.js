var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool:"inline-source-map",
  output: {
    path: path.join(__dirname, 'dist')
  },
  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader?instance=jsx',
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.scss$/,
        loaders: ['null-loader'],
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.(jpg|png)$/,
        loaders: ['null-loader'],
        include: path.join(__dirname, 'src')
      }
    ]
  }
};
