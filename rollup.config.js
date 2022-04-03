import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import external from 'rollup-plugin-peer-deps-external';
import sass from 'rollup-plugin-sass';
import { getFiles } from './scripts/getFiles';

const packageJson = require('./package.json');

const extensions = ['.js', '.ts', '.jsx', '.tsx'];

export default {
    input: [
      ...getFiles('./src/components', extensions),
      ...getFiles('./src/icon', extensions),
      ...getFiles('./src/JSDC', extensions),
      ...getFiles('./src/style', extensions),
      ...getFiles('./src/utils', extensions)
    ],
    output: {
        format: 'esm',
        sourcemap: true,
        dir: packageJson.module,
        name: 'jsdc-dui',
        preserveModules: true,
        preserveModulesRoot: 'src',
    },
    plugins: [
        external(),
        resolve(),
        commonjs(),
        typescript({
            tsconfig: './tsconfig.json',
            declaration: true,
            declarationDir: 'dist',
        }),
        sass(),
        terser()
    ]
}