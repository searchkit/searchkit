var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var apps = require("./apps")

var entries = {
}
apps.forEach(function(app){
  entries[app] = [
    'webpack-hot-middleware/client?reload=true',
    path.join(__dirname, '/apps/'+app)
  ]
})
console.log(entries)

module.exports = {
  devtool:"eval",
  entry: entries,
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].bundle.js',
    publicPath: '/static'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  resolve: {
    alias: {
      react: path.resolve(__dirname + '/../../../node_modules/react'),
      searchkit:path.resolve(__dirname + "/../../../src")
    },
    extensions:[".js", ".ts", ".tsx","", ".webpack.js", ".web.js"],
    fallback: path.join(__dirname, "node_modules")
  },

  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        loaders: ['ts']
      },
      {
        test: /\.(scss|css)$/,
        loaders: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.(jpg|png|svg)$/,
        loaders: [
            'file-loader?name=[name].[ext]'
        ]
      }
    ]
  }
};
