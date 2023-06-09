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

/* eslint-disable consistent-return */

import { expect } from '@open-wc/testing';
import sinon from 'sinon';

import {
  fetchLibrary, combineLibraries, loadLibrary, isDev,
} from '../../src/utils/library.js';
import { EventBus } from '../../src/events/eventbus.js';
import { APP_EVENTS } from '../../src/events/events.js';
import AppModel from '../../src/models/app-model.js';

const multiSheetResponse = {
  blocks: {
    total: 2,
    offset: 0,
    limit: 2,
    data: [
      {
        name: 'Columns',
        path: 'https://example.hlx.page/library/blocks/columns/columns',
      },
      {
        name: 'Cards',
        path: 'https://example.hlx.page/library/blocks/cards/cards',
      },
    ],
  },
  taxonomy: {
    total: 8,
    offset: 0,
    limit: 8,
    data: [
      {
        tag: 'Advisory Services',
      },
      {
        tag: 'Article',
      },
    ],
  },
  ':version': 3,
  ':names': [
    'blocks',
    'taxonomy',
  ],
  ':type': 'multi-sheet',
};

const singleSheetResponse = {
  total: 2,
  offset: 0,
  limit: 2,
  data: [
    {
      name: 'Columns',
      path: 'https://main--boilerplate-with-library--dylandepass.hlx.page/library/blocks/columns/columns',
    },
    {
      name: 'Cards',
      path: 'https://main--boilerplate-with-library--dylandepass.hlx.page/library/blocks/cards/cards',
    },
  ],
  ':type': 'sheet',
};

describe('Library Util Tests', () => {
  let ogFetch;
  beforeEach(() => {
    ogFetch = window.fetch;
  });
  afterEach(() => {
    window.fetch = ogFetch;
    window.libraryDev = false;
  });
  describe('fetchLibrary', () => {
    it('Test library fetch with no supplied library', async () => {
      const mockDomain = 'https://example.com';
      window.fetch = () => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(multiSheetResponse),
      });
      const expectedLibrary = multiSheetResponse;
      const actualLibrary = await fetchLibrary(mockDomain);
      expect(actualLibrary).to.deep.equal(expectedLibrary);
    });
  });
  describe('combineLibraries', () => {
    it('combines two multi-sheet libraries with non-overlapping keys', async () => {
      const base = {
        ':type': 'multi-sheet',
        ':names': ['a', 'b'],
        a: { data: [1, 2, 3] },
        b: { data: [4, 5, 6] },
      };
      const supplied = {
        ':type': 'multi-sheet',
        ':names': ['c', 'd'],
        c: { data: [7, 8, 9] },
        d: { data: [10, 11, 12] },
      };

      const library = await combineLibraries(base, supplied);

      expect(library).to.deep.equal({
        a: [1, 2, 3],
        b: [4, 5, 6],
        c: [7, 8, 9],
        d: [10, 11, 12],
      });
    });

    it('combines a multi-sheet and a single sheet libraries with non-overlapping keys', async () => {
      const base = {
        ':type': 'multi-sheet',
        ':names': ['taxonomy', 'placeholders'],
        taxonomy: { data: [1, 2, 3] },
        placeholders: { data: [4, 5, 6] },
      };
      const supplied = {
        ':type': 'sheet',
        data: [
          {
            name: 'Columns',
            path: 'https://example.hlx.page/library/blocks/columns/columns',
          },
          {
            name: 'Cards',
            path: 'https://example.hlx.page/library/blocks/cards/cards',
          },
        ],
      };

      const library = await combineLibraries(base, supplied);

      expect(library).to.deep.equal({
        taxonomy: [1, 2, 3],
        placeholders: [4, 5, 6],
        blocks: [
          {
            name: 'Columns',
            path: 'https://example.hlx.page/library/blocks/columns/columns',
          },
          {
            name: 'Cards',
            path: 'https://example.hlx.page/library/blocks/cards/cards',
          },
        ],
      });
    });

    it('combines two multi-sheet libraries with overlapping keys', async () => {
      const base = {
        ':type': 'multi-sheet',
        ':names': ['a', 'b'],
        a: { data: [1, 2, 3] },
        b: { data: [4, 5, 6] },
      };
      const supplied = {
        ':type': 'multi-sheet',
        ':names': ['b', 'c'],
        b: { data: [7, 8, 9] },
        c: { data: [10, 11, 12] },
      };

      const library = await combineLibraries(base, supplied);

      expect(library).to.deep.equal({
        a: [1, 2, 3],
        b: [4, 5, 6, 7, 8, 9],
        c: [10, 11, 12],
      });
    });

    it('combines a multi-sheet and a single sheet libraries with overlapping keys', async () => {
      const base = {
        ':type': 'multi-sheet',
        ':names': ['blocks', 'placeholders'],
        blocks: {
          data: [{
            name: 'Teasers',
            path: 'https://example.hlx.page/library/blocks/columns/columns',
          },
          {
            name: 'Hero',
            path: 'https://example.hlx.page/library/blocks/cards/cards',
          }],
        },
        placeholders: { data: [4, 5, 6] },
      };
      const supplied = {
        ':type': 'sheet',
        data: [
          {
            name: 'Columns',
            path: 'https://example.hlx.page/library/blocks/columns/columns',
          },
          {
            name: 'Cards',
            path: 'https://example.hlx.page/library/blocks/cards/cards',
          },
        ],
      };

      const library = await combineLibraries(base, supplied);

      expect(library).to.deep.equal({
        placeholders: [4, 5, 6],
        blocks: [
          {
            name: 'Teasers',
            path: 'https://example.hlx.page/library/blocks/columns/columns',
          },
          {
            name: 'Hero',
            path: 'https://example.hlx.page/library/blocks/cards/cards',
          },
          {
            name: 'Columns',
            path: 'https://example.hlx.page/library/blocks/columns/columns',
          },
          {
            name: 'Cards',
            path: 'https://example.hlx.page/library/blocks/cards/cards',
          },
        ],
      });
    });

    it('returns only base library when supplied library is null', async () => {
      const base = {
        ':type': 'multi-sheet',
        ':names': ['a', 'b'],
        a: { data: [1, 2, 3] },
        b: { data: [4, 5, 6] },
      };
      const supplied = null;

      const library = await combineLibraries(base, supplied);

      expect(library).to.deep.equal({
        a: [1, 2, 3],
        b: [4, 5, 6],
      });
    });

    it('returns only base library when supplied library is undefined', async () => {
      const base = {
        ':type': 'multi-sheet',
        ':names': ['a', 'b'],
        a: { data: [1, 2, 3] },
        b: { data: [4, 5, 6] },
      };

      const library = await combineLibraries(base);

      expect(library).to.deep.equal({
        a: [1, 2, 3],
        b: [4, 5, 6],
      });
    });
  });
  describe('loadLibrary', () => {
    it('should fetch the base library and set it in the app store', async () => {
      const eventSpy = sinon.spy();
      AppModel.init();
      AppModel.appStore.context = { base: 'https://example.com/library.json' };

      window.libraryDev = true;

      window.fetch = () => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(multiSheetResponse),
      });

      EventBus.instance.addEventListener(APP_EVENTS.LIBRARY_LOADED, eventSpy);

      await loadLibrary();

      expect(AppModel.appStore.context.libraries).to.deep.equal({
        blocks: [
          {
            extended: false,
            name: 'Columns',
            url: 'https://example.com/library/blocks/columns/columns',
            path: '/library/blocks/columns/columns',
          },
          {
            extended: false,
            name: 'Cards',
            path: '/library/blocks/cards/cards',
            url: 'https://example.com/library/blocks/cards/cards',
          },
        ],
        taxonomy: [
          {
            tag: 'Advisory Services',
          },
          {
            tag: 'Article',
          },
        ],
      });

      expect(eventSpy.calledOnce).equals(true);
    });

    it('should fetch the extended library and combine it with the base library if `extends` is defined in the config', async () => {
      const eventSpy = sinon.spy();

      AppModel.init();
      AppModel.appStore.context = {
        base: 'https://example.com/library.json',
        extends: 'https://example.com/extended-library.json',
      };

      window.libraryDev = true;

      const baseLibrary = multiSheetResponse;
      const extendedLibrary = singleSheetResponse;

      window.fetch = (url) => {
        if (url === AppModel.appStore.context.base) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(baseLibrary),
          });
        }

        if (url === AppModel.appStore.context.extends) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(extendedLibrary),
          });
        }
      };
      EventBus.instance.addEventListener(APP_EVENTS.LIBRARY_LOADED, eventSpy);

      await loadLibrary();

      expect(AppModel.appStore.context.libraries).to.deep.equal({
        blocks: [
          {
            name: 'Columns',
            path: '/library/blocks/columns/columns',
            url: 'https://example.com/library/blocks/columns/columns',
            extended: false,
          },
          {
            name: 'Cards',
            path: '/library/blocks/cards/cards',
            url: 'https://example.com/library/blocks/cards/cards',
            extended: false,
          },
          {
            name: 'Columns',
            path: '/library/blocks/columns/columns',
            url: 'https://main--boilerplate-with-library--dylandepass.hlx.page/library/blocks/columns/columns',
            extended: true,
          },
          {
            name: 'Cards',
            path: '/library/blocks/cards/cards',
            url: 'https://main--boilerplate-with-library--dylandepass.hlx.page/library/blocks/cards/cards',
            extended: true,
          },
        ],
        taxonomy: [{ tag: 'Advisory Services' }, { tag: 'Article' }],
      });

      expect(eventSpy.calledOnce).equals(true);
    });
  });
  describe('isDev', () => {
    it('should return true if window.libraryDev is true', () => {
      window.libraryDev = true;
      const result = isDev();
      expect(result).equals(true);
    });

    it('should return false if window.libraryDev is false', () => {
      window.libraryDev = false;
      const result = isDev();
      expect(result).equals(false);
    });
  });
});
