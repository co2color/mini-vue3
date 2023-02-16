import typescript from '@rollup/plugin-typescript'
import packagejson from './package.json'

export default {
  input: './src/index.ts',
  output: [
    {
      file: packagejson.main,
      format: 'cjs',
    },
    {
      file: packagejson.module,
      format: 'es',
    },
  ],
  plugins: [typescript()],
}
