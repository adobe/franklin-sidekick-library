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

module.exports = {
  root: true,
  extends: ['@adobe/helix', '@open-wc/eslint-config'],
  env: {
    browser: true,
  },
  parserOptions: {
    allowImportExportEverywhere: true,
    sourceType: 'module',
    requireConfigFile: false,
    ecmaVersion: 2022,
  },
  rules: {
    'no-use-before-define': 'off',
    'class-methods-use-this': 'off',
    'no-constructor-return': 'off',
    'import/no-extraneous-dependencies': 'off',
    'lit-a11y/anchor-is-valid': 'off',
    'lit-a11y/click-events-have-key-events': 'off',
    'no-await-in-loop': 'off',
  },
  ignorePatterns: [
    '.vscode/*',
    'coverage/*',
    'dist/*',
  ],
  overrides: [],
};
