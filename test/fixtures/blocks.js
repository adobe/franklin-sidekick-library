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
import { COLUMNS_CENTER_BACKGROUND_STUB, COLUMNS_DEFAULT_STUB } from './stubs/columns.js';
import {
  TABS_DEFAULT_STUB_SECTION_1,
  TABS_DEFAULT_STUB_SECTION_2,
  TABS_DEFAULT_STUB_SECTION_3,
  TABS_DEFAULT_STUB_SECTION_4,
} from './stubs/tabs.js';
import { DEFAULT_CONTENT_STUB } from './stubs/default-content.js';
import { COMPOUND_BLOCK_STUB } from './stubs/compound-block.js';
import { TEMPLATE_STUB } from './stubs/template.js';

export function mockBlock(html, variants = [], wrap = false) {
  const clone = html.cloneNode(true);
  if (variants.length > 0) {
    clone.classList.add(...variants);
  }
  return wrap ? createTag('div', undefined, clone) : clone;
}

export function createMetadataElement(type, libraryMetadata) {
  console.log(`creating metadata element with class '${type}'`);

  const libraryMetadataDiv = createTag('div', { class: type });
  Object.keys(libraryMetadata).forEach((key) => {
    const container = createTag('div');
    container.appendChild(createTag('div', undefined, key));
    container.appendChild(createTag('div', undefined, libraryMetadata[key]));
    libraryMetadataDiv.appendChild(container);
  });
  return libraryMetadataDiv;
}

export function addLibraryMetadata(html, libraryMetadata) {
  html.appendChild(createMetadataElement('library-metadata', libraryMetadata));
}

export function addSectionMetadata(html, sectionMetadata) {
  html.appendChild(createMetadataElement('section-metadata', sectionMetadata));
}

export const cardsBlockUrl = 'https://example.hlx.test/tools/sidekick/blocks/cards/cards.plain.html';
export const mockFetchCardsPlainHTMLSuccess = (libraryMetadata) => {
  const defaultCardsBlock = mockBlock(CARDS_DEFAULT_STUB, [], true);
  const logoCardsBlock = mockBlock(CARDS_LOGOS_STUB, [], true);

  if (libraryMetadata) {
    addLibraryMetadata(defaultCardsBlock, libraryMetadata);
  }

  return fetchMock.get(cardsBlockUrl, {
    status: 200,
    body: [defaultCardsBlock.outerHTML, logoCardsBlock.outerHTML].join('\n'),
  });
};

export const mockFetchCardsPlainHTMLWithMetadataSuccess = (libraryMetadata, sectionMetadata) => {
  const defaultCardsBlock = mockBlock(CARDS_DEFAULT_STUB, [], true);
  const logoCardsBlock = mockBlock(CARDS_LOGOS_STUB, [], true);

  if (libraryMetadata) {
    addLibraryMetadata(defaultCardsBlock, libraryMetadata);
  }

  if (sectionMetadata) {
    addSectionMetadata(defaultCardsBlock, sectionMetadata);
  }

  const defaultLibraryMetadata = createTag('div', {}, createMetadataElement('library-metadata', { searchtags: 'Default Search Tag' }));

  return fetchMock.get(cardsBlockUrl, {
    status: 200,
    body: [defaultCardsBlock.outerHTML, logoCardsBlock.outerHTML, defaultLibraryMetadata.outerHTML].join('\n'),
  }, { overwriteRoutes: true });
};

export const columnsBlockUrl = 'https://example.hlx.test/tools/sidekick/blocks/columns/columns.plain.html';
export const mockFetchColumnsPlainHTMLSuccess = () => fetchMock.get(columnsBlockUrl, {
  status: 200,
  body: [mockBlock(COLUMNS_DEFAULT_STUB, [], true).outerHTML, mockBlock(COLUMNS_CENTER_BACKGROUND_STUB, [], true).outerHTML].join('\n'),
});

export const defaultContentBlockUrl = 'https://example.hlx.test/tools/sidekick/blocks/default-content/default-content.plain.html';
export const mockFetchDefaultContentPlainHTMLSuccess = () => fetchMock.get(defaultContentBlockUrl, {
  status: 200,
  body: [mockBlock(DEFAULT_CONTENT_STUB, [], false).outerHTML, mockBlock(DEFAULT_CONTENT_STUB, [], false).outerHTML].join('\n'),
});

export const mockFetchDefaultContentPlainHTMLWithMetadataSuccess = (sectionMetadata) => {
  const defaultContent = mockBlock(DEFAULT_CONTENT_STUB, [], false);

  if (sectionMetadata) {
    addSectionMetadata(defaultContent, sectionMetadata);
  }

  return fetchMock.get(defaultContentBlockUrl, {
    status: 200,
    body: [defaultContent.outerHTML].join('\n'),
  }, { overwriteRoutes: true });
};

export const compoundBlockUrl = 'https://example.hlx.test/tools/sidekick/blocks/compound-block/compound-block.plain.html';
export const mockFetchCompoundBlockPlainHTMLSuccess = () => fetchMock.get(compoundBlockUrl, {
  status: 200,
  body: [mockBlock(COMPOUND_BLOCK_STUB, [], false).outerHTML].join('\n'),
});

export const mixedBlockUrl = 'https://example.hlx.test/tools/sidekick/blocks/mixed/mixed.plain.html';
export const mockFetchMixedBlockPlainHTMLSuccess = () => fetchMock.get(mixedBlockUrl, {
  status: 200,
  body: [mockBlock(COMPOUND_BLOCK_STUB, [], false).outerHTML, mockBlock(COLUMNS_DEFAULT_STUB, [], true).outerHTML].join('\n'),
});

export const templateUrl = 'https://example.hlx.test/tools/sidekick/blocks/blog-post/blog-post.plain.html';
export const mockFetchTemplatePlainHTMLSuccess = () => fetchMock.get(templateUrl, {
  status: 200,
  body: [mockBlock(TEMPLATE_STUB, [], false).innerHTML].join('\n'),
});

export const nonExistentBlockUrl = 'https://example.hlx.test/tools/sidekick/blocks/columns/path-does-not-exist.plain.html';
export const mockFetchNonExistantPlainHTMLFailure = () => fetchMock.get(nonExistentBlockUrl, {
  status: 404,
});

export const tabsBlockUrl = 'https://example.hlx.test/tools/sidekick/blocks/tabs/tabs.plain.html';
export const mockFetchTabsPlainHTMLSuccess = () => fetchMock.get(tabsBlockUrl, {
  status: 200,
  body: [mockBlock(TABS_DEFAULT_STUB_SECTION_1, [], false).outerHTML,
    mockBlock(TABS_DEFAULT_STUB_SECTION_2, [], false).outerHTML,
    mockBlock(TABS_DEFAULT_STUB_SECTION_3, [], false).outerHTML,
    mockBlock(TABS_DEFAULT_STUB_SECTION_4, [], false).outerHTML].join('\n'),
});
