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
import { isDev } from '../utils/library.js';
import { store, defaultState } from '../store/store.js';

export default class AppModel {
  static host = 'https://main--franklin-library-host--dylandepass.hlx.live/tools/sidekick/library';

  static appStore;

  static libraries;

  static init() {
    AppModel.appStore = store(defaultState, 'app');
    AppModel.appStore.webRoot = isDev() ? './src/' : AppModel.host;
  }
}
