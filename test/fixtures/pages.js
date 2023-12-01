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
import { DEFAULT_CONTENT_STUB } from './stubs/default-content.js';
import { COLUMNS_CENTER_BACKGROUND_STUB, COLUMNS_DEFAULT_STUB } from './stubs/columns.js';
import {
  TABS_DEFAULT_STUB_SECTION_1,
  TABS_DEFAULT_STUB_SECTION_2,
  TABS_DEFAULT_STUB_SECTION_3,
  TABS_DEFAULT_STUB_SECTION_4,
} from './stubs/tabs.js';
import { COMPOUND_BLOCK_STUB } from './stubs/compound-block.js';
import { TEMPLATE_STUB } from './stubs/template.js';

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

export const columnsPageUrl = 'https://example.hlx.test/tools/sidekick/blocks/columns/columns';
export const mockFetchColumnsDocumentSuccess = () => fetchMock.get(columnsPageUrl, {
  status: 200,
  body: stubPage(stubHead('columns'), [mockBlock(COLUMNS_DEFAULT_STUB, [], true), mockBlock(COLUMNS_CENTER_BACKGROUND_STUB, [], true)]),
});

export const tabsContentPageUrl = 'https://example.hlx.test/tools/sidekick/blocks/tabs/tabs';
export const mockFetchTabsDocumentSuccess = () => fetchMock.get(tabsContentPageUrl, {
  status: 200,
  body: stubPage(stubHead('tabs'), [mockBlock(TABS_DEFAULT_STUB_SECTION_1, [], false),
    mockBlock(TABS_DEFAULT_STUB_SECTION_2, [], false),
    mockBlock(TABS_DEFAULT_STUB_SECTION_3, [], false),
    mockBlock(TABS_DEFAULT_STUB_SECTION_4, [], false)]),
});

export const compoundBlockPageUrl = 'https://example.hlx.test/tools/sidekick/blocks/compound-block/compound-block';
export const mockFetchCompoundBlockDocumentSuccess = () => fetchMock.get(compoundBlockPageUrl, {
  status: 200,
  body: stubPage(stubHead('compound-block'), [mockBlock(COMPOUND_BLOCK_STUB, [], false)]),
});

export const templatePageUrl = 'https://example.hlx.test/tools/sidekick/blocks/blog-post/blog-post';
export const mockFetchTemplateDocumentSuccess = () => fetchMock.get(templatePageUrl, {
  status: 200,
  body: stubPage(stubHead('blog-post'), [mockBlock(TEMPLATE_STUB, [], false)]),
});

export const allEditablePageUrl = 'https://example.hlx.test/tools/sidekick/blocks/alleditable/alleditable';
export const mockFetchAllEditableDocumentSuccess = () => fetchMock.get(allEditablePageUrl, {
  status: 200,
  body: stubPage(stubHead('all-editable'), [mockBlock(ALL_EDITABLE_STUB, [], true)]),
});

export const defaultContentPageUrl = 'https://example.hlx.test/tools/sidekick/blocks/default-content/default-content';
export const mockFetchDefaultContentDocumentSuccess = () => fetchMock.get(defaultContentPageUrl, {
  status: 200,
  body: stubPage(stubHead('default-content'), [mockBlock(DEFAULT_CONTENT_STUB, [], false)]),
}, { overwriteRoutes: true });

export const mockFetchInlinePageDependenciesSuccess = (blockName = 'cards') => {
  fetchMock.get('path:/scripts/scripts.js', { status: 200 }, { overwriteRoutes: true });
  fetchMock.get(`path:/blocks/${blockName}/${blockName}.css`, { status: 200 }, { overwriteRoutes: true });
  fetchMock.get('path:/styles/lazy-styles.css', { status: 200 }, { overwriteRoutes: true });
  fetchMock.get('path:/icons/arrow.svg', { status: 200 }, { overwriteRoutes: true });
  fetchMock.get('path:/icons/home.svg', { status: 200 }, { overwriteRoutes: true });
  fetchMock.get('path:/media_1.jpeg?width=2000&format=webply&optimize=medium', { status: 200 }, { overwriteRoutes: true });
  fetchMock.get('path:/media_2.jpeg?width=2000&format=webply&optimize=medium', { status: 200 }, { overwriteRoutes: true });
  fetchMock.get('path:/media_3.jpeg?width=2000&format=webply&optimize=medium', { status: 200 }, { overwriteRoutes: true });
  fetchMock.get('path:/media_4.jpeg?width=2000&format=webply&optimize=medium', { status: 200 }, { overwriteRoutes: true });
  fetchMock.get('path:/media_5.jpeg?width=2000&format=webply&optimize=medium', { status: 200 }, { overwriteRoutes: true });

  fetchMock.get('path:/media_1.jpeg', { status: 200, body: 'foobar', headers: { 'content-type': 'image/jpeg' } }, { overwriteRoutes: true });
  fetchMock.get('path:/media_2.jpeg', { status: 200, body: 'foobar', headers: { 'content-type': 'image/jpeg' } }, { overwriteRoutes: true });
  fetchMock.get('path:/media_3.jpeg', { status: 200, body: 'foobar', headers: { 'content-type': 'image/jpeg' } }, { overwriteRoutes: true });
  fetchMock.get('path:/media_4.jpeg', { status: 200, body: 'foobar', headers: { 'content-type': 'image/jpeg' } }, { overwriteRoutes: true });
  fetchMock.get('path:/media_5.jpeg', { status: 200, body: 'foobar', headers: { 'content-type': 'image/jpeg' } }, { overwriteRoutes: true });
};
