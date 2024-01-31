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

export const CARDS_BLOCK_LIBRARY_ITEM = {
  name: 'Cards',
  path: '/tools/sidekick/blocks/cards/cards',
  url: 'https://example.hlx.test/tools/sidekick/blocks/cards/cards',
};

export const COLUMNS_BLOCK_LIBRARY_ITEM = {
  name: 'Columns',
  path: '/tools/sidekick/blocks/columns/columns',
  url: 'https://example.hlx.test/tools/sidekick/blocks/columns/columns',
};

export const TABS_LIBRARY_ITEM = {
  name: 'Tabs',
  path: '/tools/sidekick/blocks/tabs/tabs',
  url: 'https://example.hlx.test/tools/sidekick/blocks/tabs/tabs',
};

export const COMPOUND_BLOCK_LIBRARY_ITEM = {
  name: 'Compound Block',
  path: '/tools/sidekick/blocks/compound-block/compound-block',
  url: 'https://example.hlx.test/tools/sidekick/blocks/compound-block/compound-block',
};

export const TEMPLATE_LIBRARY_ITEM = {
  name: 'Blog Post Template',
  path: '/tools/sidekick/blocks/blog-post/blog-post',
  url: 'https://example.hlx.test/tools/sidekick/blocks/blog-post/blog-post',
};

export const MIXED_LIBRARY_ITEM = {
  name: 'Mixed item with both compound and regular blocks',
  path: '/tools/sidekick/blocks/mixed/mixed',
  url: 'https://example.hlx.test/tools/sidekick/blocks/mixed/mixed',
};

export const NON_EXISTENT_BLOCK_LIBRARY_ITEM = {
  name: 'Columns',
  path: '/tools/sidekick/blocks/columns/path-does-not-exist',
  url: 'https://example.hlx.test/tools/sidekick/blocks/columns/path-does-not-exist',
};

export const DEFAULT_CONTENT_LIBRARY_ITEM = {
  name: 'Default Content',
  path: '/tools/sidekick/blocks/default-content/default-content',
  url: 'https://example.hlx.test/tools/sidekick/blocks/default-content/default-content',
};

export const PAGE_LIBRARY_ITEM = {
  name: 'Template',
  path: '/tools/sidekick/blocks/page-template/page-template',
  url: 'https://example.hlx.test/tools/sidekick/blocks/page-template/page-template',
};

const constructSingleSheetJSONBody = data => ({
  body: {
    total: data.length,
    offset: 0,
    limit: data.length,
    data: [...data],
    ':type': 'sheet',
  },
});

const constructPlugin = (name, data) => {
  const plugin = {};
  plugin[name] = {
    total: data.length,
    offset: 0,
    limit: data.length,
    data: [...data],
  };
  return plugin;
};

const constructMultiSheetJSONBody = (plugins) => {
  const body = {
    ':version': 3,
    ':names': [...plugins.map(p => Object.keys(p)[0])],
    ':type': 'multi-sheet',
  };

  plugins.forEach((plugin) => {
    const name = Object.keys(plugin)[0];
    body[name] = plugin[name];
  });
  return body;
};

export const multiSheetUrl = 'https://example.hlx.test/tools/sidekick/library-multi-sheet.json';
export const mockFetchMultiSheetLibrarySuccess = () => {
  const blockPlugin = constructPlugin('blocks', [CARDS_BLOCK_LIBRARY_ITEM, COLUMNS_BLOCK_LIBRARY_ITEM]);
  const tagsPLugin = constructPlugin('tags', [{ tag: 'foobar' }, { tag: 'foo' }, { tag: 'car' }]);
  return fetchMock.get(multiSheetUrl, {
    status: 200,
    ...constructMultiSheetJSONBody([blockPlugin, tagsPLugin]),
  });
};

export const singleSheetUrl = 'https://example.hlx.test/tools/sidekick/library-single-sheet.json';
export const mockFetchSingleSheetLibrarySuccess = () => fetchMock.get(singleSheetUrl, {
  status: 200,
  ...constructSingleSheetJSONBody([CARDS_BLOCK_LIBRARY_ITEM, COLUMNS_BLOCK_LIBRARY_ITEM]),
});

export const sheetWithTemplate = 'https://example.hlx.test/tools/sidekick/library-single-sheet-with-template.json';
export const mockFetchSheetWithTemplateSuccess = () => fetchMock.get(sheetWithTemplate, {
  status: 200,
  ...constructSingleSheetJSONBody([TEMPLATE_LIBRARY_ITEM]),
});

export const unknownPluginSheetUrl = 'https://example.hlx.test/tools/sidekick/unknown-plugin-sheet.json';
export const mockFetchSheetLibraryWithUnknownPluginSuccess = () => {
  const unknownPlugin = constructPlugin('foobar', [{ one: 'foo' }, { two: 'bar' }]);
  const unknownPlugin2 = constructPlugin('other', [{ one: 'foo' }, { two: 'bar' }]);
  return fetchMock.get(unknownPluginSheetUrl, {
    status: 200,
    ...constructMultiSheetJSONBody([unknownPlugin, unknownPlugin2]),
  });
};
