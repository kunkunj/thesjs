import babel from 'rollup-plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload'
//压缩工具
const { terser } = require('rollup-plugin-terser');
const packageJson = require('./package.json');
//清除工具
import clear from 'rollup-plugin-clear';

function run() {
  return (
    process.env.ENV &&
    serve({
      open: true,
      openPage: '/demo/' + process.env.ENV + '/index.html',
      port: 8080,
      contentBase: '',
    })
  );
}
export default {
  input: './src/index.ts',
  output: [
    {
      file: 'dist/thes.min.js',
      format: 'umd',
      sourcemap: true,
      name: packageJson.name,
    },
  ],
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
    resolve(),
    commonjs(),
    typescript(),
    terser(),
    clear({
      targets: ['dist'], // 项目打包编译生成的目录
      watch: true, // 实时监听文件变化
    }),
    livereload(),
    run(),
  ],
};
