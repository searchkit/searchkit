const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const copyrightBanner = require("fs").readFileSync("./COPYRIGHT", "utf-8")
const autoprefixer = require('autoprefixer')

module.exports = {
  entry: {
    "ignore":['./theming/index.ts'],
    "bundle":['./src/index.ts']
  },
  output: {
    path: path.join(__dirname, 'release'),
    filename: '[name].js',
    library:["Searchkit"],
    libraryTarget:"umd",
    publicPath: '',
    css: 'theme.css'
  },
  resolve: {
    extensions:[".js", ".ts", ".tsx","", ".webpack.js", ".web.js", ".scss"]
  },
  postcss: function () {
    return [autoprefixer]
  },
  plugins: [
    new webpack.BannerPlugin(copyrightBanner, {entryOnly:true}),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new ExtractTextPlugin("theme.css", {allChunks:true}),
    new webpack.optimize.UglifyJsPlugin({
      mangle: {
        except: ['require', 'export', '$super']
      },
      compress: {
        warnings: false,
        sequences: true,
        dead_code: true,
        conditionals: true,
        booleans: true,
        unused: true,
        if_return: true,
        join_vars: true,
        drop_console: true
      }
    })
  ],
  externals: {
    "react": "React",
    "react-dom":"ReactDOM"
  },
  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        loaders: ['ts'],
        include: [path.join(__dirname, 'src'),path.join(__dirname, 'theming')]
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract(require.resolve("style-loader"),require.resolve("css-loader")+"!"+require.resolve("postcss-loader")+"!"+require.resolve("sass-loader")),
        include: path.join(__dirname, 'theming')
      },
      {
        test: /\.(jpg|png|svg)$/,
        loaders: [
            'file-loader?name=[path][name].[ext]'
        ],
        include: path.join(__dirname, 'theming')
      }
    ]
  }
};
