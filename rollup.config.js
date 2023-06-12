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
import { importMetaAssets } from '@web/rollup-plugin-import-meta-assets';
import esbuild from 'rollup-plugin-esbuild';
import copy from 'rollup-plugin-copy';
import sourcemaps from 'rollup-plugin-sourcemaps';

const baseConfig = createBasicConfig();

export default merge(baseConfig, {
  input: 'src/index.js',
  output: {
    format: 'es',
    entryFileNames: 'index.js',
    chunkFileNames: '[name].js',
    exports: 'named',
    sourcemap: true,
  },
  preserveEntrySignatures: true,
  plugins: [
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
        { src: 'src/utils/rum.js', dest: './dist' },
        { src: 'src/locales', dest: './dist' },
        { src: 'src/events/events.js', dest: './dist' }],
      // set flatten to false to preserve folder structure
      flatten: false,
    }),
    /** Bundle assets references via import.meta.url */
    importMetaAssets(),
  ],
});
