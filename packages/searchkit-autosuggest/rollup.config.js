import path from 'path'
import postCss from 'rollup-plugin-postcss'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import uglify from 'rollup-plugin-uglify'
import license from 'rollup-plugin-license'
import typescriptPlugin from 'rollup-plugin-typescript2'
import typescript from 'typescript'

const pkg = require('./package.json')

export default {
  name: 'SearchkitAutosuggest',
  input: 'src/index.ts',
  output: {
    file: pkg.main,
    format: 'umd'
  },
  external: ['searchkit', 'react'],
  globals: {
    react: 'React',
    searchkit: 'Searchkit'
  },

  plugins: [
    postCss(),
    commonjs(),
    resolve(),
    typescriptPlugin({
      typescript,
      tsconfigOverride: {
        compilerOptions: {
          target: 'es5',
          declaration: false
        }
      }
    }),
    uglify(),
    license({
      banner: {
        file: path.join(__dirname, '../../BANNER')
      }
    })
  ]
}
