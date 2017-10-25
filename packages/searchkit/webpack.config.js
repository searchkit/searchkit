const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const copyrightBanner = require("fs").readFileSync("../../COPYRIGHT", "utf-8")
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
    publicPath: ''
  },
  resolve: {
    extensions:[".js", ".ts", ".tsx", ".webpack.js", ".web.js", ".scss"]
  },

  plugins: [
    new webpack.BannerPlugin({banner:copyrightBanner, entryOnly:true}),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new ExtractTextPlugin("theme.css", {allChunks:true}),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production'),
      },
    }),
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
    'react': {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react',
      umd: 'react',
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      amd: 'react-dom',
      umd: 'react-dom',
    }
  },
  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        loaders: ['ts-loader'],
        include: [path.join(__dirname, 'src'),path.join(__dirname, 'theming')]
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({
          fallback:"style-loader",
          use:[
            {
              loader:"css-loader",
              options: { 
                sourceMap:true,
                minimize:true,
                importLoaders:2
              }
            },
            {
              loader:"postcss-loader"             
            },
            {
              loader:"sass-loader", 
              options:{sourceMap:true}
            }
          ]

        }),          
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
