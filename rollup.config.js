import vue from 'rollup-plugin-vue'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import replace from '@rollup/plugin-replace'
import { getBabelOutputPlugin } from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser'


const plugins = [
  vue(), 
  peerDepsExternal(),
  createReplace(),
  getBabelOutputPlugin({
    presets: ['@babel/preset-env'],
    allowAllFormats: true,
    exclude: 'node_modules/**',
  })
]

if (process.env.NODE_ENV === 'production') {
  plugins.push(terser({
    compress: {
      pure_funcs: ["console.log"]
    }
  }))
}


export default [
  {
    input: 'src/index.js',
    external: ['vue', 'vue-router', '@vue/shared'],
    output: [
      {
        format: 'esm',
        file: 'dist/library.esm.js'
        // file: `/Users/wxkmac/Documents/Github/stack-keep-alive-js-sample/debug/vue.esm.js`,
      },
      {
        format: 'cjs',
        file: 'dist/library.cjs.js'
      },
      {
          name: 'StackKeepAlive',
          format: 'umd',
          // file: 'dist/index.js',
          file: `/Users/wxkmac/Documents/Github/stack-keep-alive-js-sample/debug/index.js`,
          globals: {
            'vue': 'vue',
            'vue-router': 'VueRouter',
            '@vue/shared': 'vue/shared'
          },
      }
    ],
    plugins
  }
]

function createReplace() {
    const replacements = {
        __DEV__ : true,
        __FEATURE_SUSPENSE__ : true,
        __COMPAT__ : false,
        __TEST__: false,
    }
    return replace({
        // @ts-ignore
        values: replacements,
        preventAssignment: true
      })
}