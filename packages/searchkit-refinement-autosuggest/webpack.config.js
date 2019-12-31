const path = require('path')
const copyrightBanner = require('fs').readFileSync('../../BANNER', 'utf-8')
const webpack = require('webpack')

module.exports = {
  entry: {
    bundle: ['./src/index.ts']
  },
  output: {
    path: path.join(__dirname, 'umd'),
    filename: '[name].js',
    library: ['SearchkitRefinementAutosuggest'],
    libraryTarget: 'umd',
    publicPath: ''
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.webpack.js', '.web.js', '.scss']
  },

  plugins: [
    new webpack.BannerPlugin({ banner: copyrightBanner, entryOnly: true }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
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
      umd: 'react'
    },
    'searchkit': {
      root: 'Searchkit',
      commonjs2: 'searchkit',
      commonjs: 'searchkit',
      amd: 'searchkit',
      umd: 'searchkit'
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      amd: 'react-dom',
      umd: 'react-dom'
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          compilerOptions: {
            target: 'es5',
            declaration: false
          }
        },
        include: [path.join(__dirname, 'src')]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
}
