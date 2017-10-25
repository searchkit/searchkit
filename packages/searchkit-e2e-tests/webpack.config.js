var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var apps = require("./apps")

const isProduction = process.env.NODE_ENV === 'production'
var entries = {
}
apps.forEach(function(app){
  entries[app] = [
    path.join(__dirname, '/src/apps/'+app)
  ]  
  !isProduction && entries[app].unshift(
    'webpack-hot-middleware/client?reload=true')  
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
  plugins: isProduction ? [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      },
    }),
  ] : [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ],
  resolve: {
    extensions:[".js", ".ts", ".tsx", ".webpack.js", ".web.js"],
    modules:[
      path.resolve(__dirname, "./node_modules"),
      path.resolve(__dirname, "./node_modules/searchkit/node_modules")
    ]
  },

  module: {
    loaders: [
      {
        test: /\.tsx?$/,        
        loaders: ['ts-loader']
      },
      {
        test: /\.(scss|css)$/,
        loaders: [
          "style-loader", 
          "css-loader",
          "sass-loader"                    
        ]
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
