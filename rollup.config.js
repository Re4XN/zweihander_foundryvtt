import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss'
import autoprefixer from 'autoprefixer';
import reporter from 'postcss-reporter';
import doiuse from 'doiuse';
import { uglify } from 'rollup-plugin-uglify';
const banner = `/*
THIS IS A GENERATED/BUNDLED FILE BY ROLLUP
if you want to view the source visit the plugins github repository
*/
`;

const dev = process.env.PRODUCTION_MODE === undefined;

export default {
  input: "./module/main.js",
  output: {
    file: "zweihander.js",
    sourcemap: true,
    sourcemapExcludeSources: dev,
    format: "es",
    banner
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    postcss({
      sourceMap: true,
      extract: true,
      minimize: !dev,
      plugins: [
        require('colorguard'),
        autoprefixer(),
        // doiuse({browsers: ['> 1.5% and last 3 versions']}),
        require('postcss-assets')({
          loadPaths: ['assets/'],
          relative: '.'
        }),
        reporter({ clearReportedMessages: true })
        ]
    }),
    !dev && uglify()
  ]
};