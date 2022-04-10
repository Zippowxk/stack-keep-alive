import vue from 'rollup-plugin-vue'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import replace from '@rollup/plugin-replace'

export default [
  {
    input: 'src/index.js',
    output: [
      {
        format: 'esm',
        file: 'dist/library.mjs'
      },
      {
        format: 'cjs',
        file: 'dist/library.js'
      },
      {
          name: 'StackKeepAlive',
          format: 'umd',
          file: `dist/index.js`,
      }
    ],
    plugins: [
      vue(), peerDepsExternal(),
      createReplace()
    ]
  }
]

function createReplace() {
    const replacements = {
        __DEV__ : true,
        __FEATURE_SUSPENSE__ : false,
        __COMPAT__ : false,
    }
    return replace({
        // @ts-ignore
        values: replacements,
        preventAssignment: true
      })
}