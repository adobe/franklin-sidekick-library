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

/* eslint-disable no-unused-expressions */

import { html } from 'lit';
import {
  fixture, expect, waitUntil, fixtureCleanup,
} from '@open-wc/testing';
import fetchMock from 'fetch-mock/esm/client';
import { recursiveQuery, recursiveQueryAll, simulateTyping } from './test-utils.js';
import AppModel from '../src/models/app-model.js';
import { unloadPlugin } from '../src/utils/plugin.js';
import '../src/index.js';
import '../src/plugins/blocks/blocks.js';
import {
  mockFetchMultiSheetLibrarySuccess,
  mockFetchSingleSheetLibrarySuccess,
  singleSheetUrl,
  multiSheetUrl,
  mockFetchSheetLibraryWithUnknownPluginSuccess,
  unknownPluginSheetUrl,
  sheetWithTemplate,
  mockFetchSheetWithTemplateSuccess,
} from './fixtures/libraries.js';
import { mockFetchEnLocalesSuccess } from './fixtures/locales.js';
import { mockFetchCardsPlainHTMLSuccess, mockFetchColumnsPlainHTMLSuccess, mockFetchTemplatePlainHTMLSuccess } from './fixtures/blocks.js';
import { setURLParams } from '../src/utils/dom.js';
import { mockFetchColumnsDocumentSuccess, mockFetchInlinePageDependenciesSuccess, mockFetchTemplateDocumentSuccess } from './fixtures/pages.js';

describe('FranklinLibrary', () => {
  beforeEach(() => {
    window.libraryDev = true;
    mockFetchEnLocalesSuccess();
    mockFetchSingleSheetLibrarySuccess();
    mockFetchMultiSheetLibrarySuccess();
    mockFetchCardsPlainHTMLSuccess();
    mockFetchColumnsPlainHTMLSuccess();
    mockFetchColumnsDocumentSuccess();
    mockFetchSheetWithTemplateSuccess();
    mockFetchTemplateDocumentSuccess();
    mockFetchTemplatePlainHTMLSuccess();
  });

  afterEach(() => {
    fetchMock.restore();
    fixtureCleanup();
  });

  it('renders container', async () => {
    const element = await fixture(html`<sidekick-library></sidekick-library>`);
    const container = element.shadowRoot.querySelector('.container');
    await expect(container).to.not.be.null;
  });

  it('passes the a11y audit', async () => {
    const element = await fixture(html`<sidekick-library></sidekick-library>`);
    await expect(element).shadowDom.to.be.accessible();
  });

  it('error message when no config', async () => {
    const library = document.createElement('sidekick-library');

    await fixture(library);

    await waitUntil(
      () => recursiveQuery(library, 'illustrated-message'),
      'Element did not render children',
    );

    const message = recursiveQuery(library, 'sp-illustrated-message');
    expect(message).to.be.visible;
    expect(message.getAttribute('heading')).to.equal('Invalid Configuration');
    expect(message.getAttribute('description')).to.equal('The library is misconfigured');
  });

  it('loads single sheet', async () => {
    const library = document.createElement('sidekick-library');
    library.config = {
      base: singleSheetUrl,
    };

    await fixture(library);

    await waitUntil(
      () => recursiveQuery(library, 'sp-menu-item'),
      'Element did not render children',
    );

    const picker = recursiveQuery(library, 'sp-picker');
    const items = picker.querySelectorAll('sp-menu-item');
    expect([...items].length).to.equal(1);
  });

  it('loads extended library', async () => {
    const library = document.createElement('sidekick-library');
    library.config = {
      base: singleSheetUrl,
      extends: multiSheetUrl,
    };

    await fixture(library);

    await waitUntil(
      () => recursiveQuery(library, 'sp-menu-item'),
      'Element did not render children',
    );

    const picker = recursiveQuery(library, 'sp-picker');
    const items = picker.querySelectorAll('sp-menu-item');
    expect([...items].length).to.equal(2);
  });

  it('loads multi sheet', async () => {
    const library = document.createElement('sidekick-library');
    library.config = {
      base: multiSheetUrl,
    };

    await fixture(library);

    await waitUntil(
      () => recursiveQuery(library, 'sp-menu-item'),
      'Element did not render children',
    );

    const picker = recursiveQuery(library, 'sp-picker');
    const items = picker.querySelectorAll('sp-menu-item');
    expect([...items].length).to.equal(2);
  });

  it('unknown plugin', async () => {
    mockFetchSheetLibraryWithUnknownPluginSuccess();

    const library = document.createElement('sidekick-library');
    library.config = {
      base: unknownPluginSheetUrl,
    };

    await fixture(library);

    await waitUntil(
      () => recursiveQuery(library, 'sp-menu-item'),
      'Element did not render children',
    );

    const picker = recursiveQuery(library, 'sp-picker');

    picker.value = 'foobar';
    picker.dispatchEvent(new Event('change'));

    const toast = recursiveQuery(library, 'sp-toast');
    expect(toast).to.be.visible;
    expect(toast.getAttribute('variant')).to.equal('negative');
    expect(toast.innerHTML).to.equal('Unknown plugin');
  });

  it('plugin with error', async () => {
    mockFetchSheetLibraryWithUnknownPluginSuccess();
    const library = document.createElement('sidekick-library');
    library.config = {
      base: unknownPluginSheetUrl,
      foobar: '/foobar.js',
    };

    await fixture(library);

    await waitUntil(
      () => recursiveQuery(library, 'sp-menu-item'),
      'Element did not render children',
    );

    const picker = recursiveQuery(library, 'sp-picker');

    picker.value = 'Foobar';
    picker.dispatchEvent(new Event('click'));

    await waitUntil(
      () => recursiveQuery(library, 'sp-toast'),
      'Element did not render children',
    );
    const toast = recursiveQuery(library, 'sp-toast');
    expect(toast).to.be.visible;
    expect(toast.getAttribute('variant')).to.equal('negative');
    expect(toast.innerHTML).to.equal('Error loading plugin');
  });

  it('unload plugin', async () => {
    const library = document.createElement('sidekick-library');
    library.config = {
      base: singleSheetUrl,
    };

    await fixture(library);

    await waitUntil(
      () => recursiveQuery(library, 'sp-menu-item'),
      'Element did not render children',
    );

    unloadPlugin(AppModel);

    expect(AppModel.appStore.context.activePlugin).to.equal(undefined);
  });

  it('deep linking to block', async () => {
    mockFetchInlinePageDependenciesSuccess('columns');
    setURLParams([['plugin', 'blocks'], ['path', '/tools/sidekick/blocks/columns/columns'], ['index', 1]]);
    const library = document.createElement('sidekick-library');
    library.config = {
      base: singleSheetUrl,
    };

    await fixture(library);

    await waitUntil(
      () => recursiveQuery(library, 'sp-menu-item'),
      'Element did not render children',
    );

    const expandedItem = recursiveQuery(library, 'sp-sidenav-item[expanded]');
    expect(expandedItem).to.not.be.null;
    expect(expandedItem.getAttribute('label')).to.equal('Columns');

    await waitUntil(
      () => recursiveQuery(library, '.details-container .action-bar .title'),
      'Element did not render children',
    );

    const blockTitle = recursiveQuery(library, '.details-container .action-bar .title');
    expect(blockTitle.textContent).to.equal('columns (center, background)');

    const blockRenderer = recursiveQuery(library, 'block-renderer');
    const iframe = blockRenderer.shadowRoot.querySelector('iframe');
    await waitUntil(
      () => recursiveQuery(iframe.contentDocument, '.columns'),
      'Element did not render children',
    );

    const columnsBlock = iframe.contentDocument.querySelector('.columns');
    const h2 = columnsBlock.querySelector('h2');
    expect(h2.textContent).to.equal('Lorem Ipsum');
  });

  it('deep linking to a template', async () => {
    setURLParams([['plugin', 'blocks'], ['path', '/tools/sidekick/blocks/blog-post/blog-post']], ['index']);
    const library = document.createElement('sidekick-library');
    library.config = {
      base: sheetWithTemplate,
    };

    await fixture(library);

    await waitUntil(
      () => recursiveQuery(library, 'sp-menu-item'),
      'Element did not render children',
    );

    await waitUntil(
      () => recursiveQuery(library, 'sp-sidenav-item[expanded]'),
      'Element did not render children',
    );

    const expandedItem = recursiveQuery(library, 'sp-sidenav-item[expanded]');
    expect(expandedItem).to.not.be.null;
    expect(expandedItem.getAttribute('label')).to.equal('Templates');

    await waitUntil(
      () => recursiveQuery(library, '.action-bar .title'),
      'Element did not render children',
    );

    const blockTitle = recursiveQuery(library, '.details-container .action-bar .title');
    expect(blockTitle.textContent).to.equal('Blog Post Template');

    const blockRenderer = recursiveQuery(library, 'block-renderer');
    const iframe = blockRenderer.shadowRoot.querySelector('iframe');
    await waitUntil(
      () => recursiveQuery(iframe.contentDocument, '.blockquote'),
      'Element did not render children',
    );

    const blockquote = iframe.contentDocument.querySelector('.blockquote');
    expect(blockquote).to.exist;
  });

  it('deep linking to tags plugin', async () => {
    mockFetchInlinePageDependenciesSuccess('columns');
    setURLParams([['plugin', 'tags']]);
    const library = document.createElement('sidekick-library');
    library.config = {
      base: multiSheetUrl,
      tags: 'https://main--franklin-library-host--dylandepass.hlx.live/tools/sidekick/library/plugins/tags/tags.js',
    };

    await fixture(library);

    await waitUntil(
      () => recursiveQuery(library, 'sp-menu-item'),
      'Element did not render children',
    );

    await waitUntil(
      () => recursiveQuery(library, '#tags-plugin'),
      'Element did not render children',
    );

    const pluginRenderer = recursiveQuery(library, '#tags-plugin');
    const menuItems = recursiveQueryAll(pluginRenderer, 'sp-menu-item');
    expect(menuItems.size).to.equal(3);
  });

  it('custom plugin search should work', async () => {
    AppModel.libraryHost = 'https://main--franklin-library-host--dylandepass.hlx.live/tools/sidekick/library';

    const library = document.createElement('sidekick-library');
    library.config = {
      base: multiSheetUrl,
      tags: 'https://main--franklin-library-host--dylandepass.hlx.live/tools/sidekick/library/plugins/tags/tags.js',
    };

    await fixture(library);

    await waitUntil(
      () => recursiveQuery(library, 'sp-menu-item'),
      'Element did not render children',
    );

    const picker = recursiveQuery(library, 'sp-picker');
    picker.value = 'tags';
    picker.dispatchEvent(new Event('change'));

    await waitUntil(
      () => recursiveQuery(library, '#tags-plugin'),
      'Element did not render children',
    );

    await waitUntil(
      () => recursiveQuery(library, '#search-button'),
      'Element did not render children',
    );

    const searchButton = recursiveQuery(library, '#search-button');
    searchButton.dispatchEvent(new Event('click'));

    await waitUntil(
      () => recursiveQuery(library, 'input'),
      'Element did not render children',
    );

    const middleBar = recursiveQuery(library, '.middle-bar');
    expect(middleBar.classList.contains('search-active')).to.be.true;

    const input = recursiveQuery(library, 'sp-search');

    await simulateTyping(input, 'foo');
    input.dispatchEvent(new Event('input'));

    const pluginRenderer = recursiveQuery(library, '#tags-plugin');
    const pluginSideNav = recursiveQuery(pluginRenderer, 'sp-menu');
    const items = pluginSideNav.querySelectorAll('sp-menu-item');
    expect([...items].length).to.equal(2);
    searchButton.dispatchEvent(new Event('click'));
    expect(middleBar.classList.contains('search-active')).to.be.false;
  });
});
