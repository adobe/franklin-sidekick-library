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

import fetchMock from 'fetch-mock/esm/client';
import { createTag } from '../../src/utils/dom.js';
import { CARDS_DEFAULT_STUB, CARDS_LOGOS_STUB } from './stubs/cards.js';
import { stubHead, stubPage } from './stubs/pages.js';
import { ALL_EDITABLE_STUB } from './stubs/editable.js';

export function mockBlock(html, variants = [], wrap = false) {
  const clone = html.cloneNode(true);
  if (variants.length > 0) {
    clone.classList.add(...variants);
  }
  return wrap ? createTag('div', undefined, clone) : clone;
}

export const cardsPageUrl = 'https://example.hlx.test/tools/sidekick/blocks/cards/cards';
export const mockFetchCardsDocumentSuccess = () => fetchMock.get(cardsPageUrl, {
  status: 200,
  body: stubPage(stubHead('cards'), [mockBlock(CARDS_DEFAULT_STUB, [], true), mockBlock(CARDS_LOGOS_STUB, [], true)]),
});

export const allEditablePageUrl = 'https://example.hlx.test/tools/sidekick/blocks/alleditable/alleditable';
export const mockFetchAllEditableDocumentSuccess = () => fetchMock.get(allEditablePageUrl, {
  status: 200,
  body: stubPage(stubHead('all-editable'), [mockBlock(ALL_EDITABLE_STUB, [], true)]),
});

export const mockFetchInlinePageDependenciesSuccess = (blockName = 'cards') => {
  fetchMock.get('https://example.hlx.test/scripts.js', { status: 200 }, { overwriteRoutes: true });
  fetchMock.get(`https://example.hlx.test/blocks/${blockName}/${blockName}.css`, { status: 200 }, { overwriteRoutes: true });
  fetchMock.get('https://example.hlx.test/styles/lazy-styles.css', { status: 200 }, { overwriteRoutes: true });
  fetchMock.get('https://example.hlx.test/icons/arrow.svg', { status: 200 }, { overwriteRoutes: true });
  fetchMock.get('https://example.hlx.test/media_1.jpeg?width=2000&format=webply&optimize=medium', { status: 200 }, { overwriteRoutes: true });
  fetchMock.get('https://example.hlx.test/media_2.jpeg?width=2000&format=webply&optimize=medium', { status: 200 }, { overwriteRoutes: true });
  fetchMock.get('https://example.hlx.test/media_3.jpeg?width=2000&format=webply&optimize=medium', { status: 200 }, { overwriteRoutes: true });
  fetchMock.get('https://example.hlx.test/media_4.jpeg?width=2000&format=webply&optimize=medium', { status: 200 }, { overwriteRoutes: true });
  fetchMock.get('https://example.hlx.test/media_5.jpeg?width=2000&format=webply&optimize=medium', { status: 200 }, { overwriteRoutes: true });
};
