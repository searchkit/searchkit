import typescript from 'rollup-plugin-typescript'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json'

export default {
  entry: './src/index.ts',
  dest: 'bundle.js',
  plugins: [
    json({}),
    commonjs({
      // exclude: ['node_modules/lodash-es/**']
    }),
    typescript({
      typescript: require('typescript')
    }),
    resolve({
      jsnext: true, main: true, browser: true, preferBuiltins: true, modulesOnly: true
    })
  ]
}
