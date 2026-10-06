/*
 * Copyright 2024 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { expect } from '@open-wc/testing';
import AppModel from '../../src/models/app-model.js';

describe('AppModel', () => {
  describe('libraryHost', () => {
    it('is the location of the library itself', () => {
      const libraryUrl = new URL('../../src/models/app-model.js', import.meta.url).href;
      expect(AppModel.libraryHost).to.equal(libraryUrl.substring(0, libraryUrl.lastIndexOf('/')));
    });

    it('is the web root unless running in dev mode', () => {
      const { libraryDev } = window;
      try {
        window.libraryDev = false;
        AppModel.init();
        expect(AppModel.appStore.webRoot).to.equal(AppModel.libraryHost);

        window.libraryDev = true;
        AppModel.init();
        expect(AppModel.appStore.webRoot).to.equal('./src');
      } finally {
        window.libraryDev = libraryDev;
      }
    });
  });
});
