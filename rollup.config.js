/*
 * Copyright 2023 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import merge from 'deepmerge';
import { createBasicConfig } from '@open-wc/building-rollup';
import nodeResolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import html from '@web/rollup-plugin-html';
import { importMetaAssets } from '@web/rollup-plugin-import-meta-assets';
import esbuild from 'rollup-plugin-esbuild';
import copy from 'rollup-plugin-copy';
import sourcemaps from 'rollup-plugin-sourcemaps';

const baseConfig = createBasicConfig();

export default merge(baseConfig, {
  input: 'index.html',
  output: {
    format: 'es',
    entryFileNames: 'library.js',
    chunkFileNames: '[name].js',
    exports: 'named',
    sourcemap: true,
  },
  preserveEntrySignatures: false,
  plugins: [
    /** Enable using HTML as rollup entrypoint */
    html({
      minify: false,
    }),
    /** Resolve bare module imports */
    nodeResolve(),
    /** Minify JS, compile JS to a lower language target */
    esbuild({
      minify: true,
      target: ['chrome64', 'firefox67', 'safari11.1'],
    }),
    sourcemaps(),
    copy({
      targets: [{ src: 'src/plugins/**/*', dest: './dist' },
        { src: 'src/utils/dom.js', dest: './dist' },
        { src: 'src/locales', dest: './dist' }],
      // set flatten to false to preserve folder structure
      flatten: false,
    }),
    /** Bundle assets references via import.meta.url */
    importMetaAssets(),
    /** Minify html and css tagged template literals */
    babel({
      plugins: [
        [
          require.resolve('babel-plugin-template-html-minifier'),
          {
            modules: { lit: ['html', { name: 'css', encapsulation: 'style' }] },
            failOnError: false,
            strictCSS: true,
            htmlMinifier: {
              collapseWhitespace: true,
              conservativeCollapse: true,
              removeComments: true,
              caseSensitive: true,
              minifyCSS: true,
            },
          },
        ],
      ],
    }),
  ],
});
