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
  fixture, expect, waitUntil,
} from '@open-wc/testing';
import fetchMock from 'fetch-mock/esm/client';
import { recursiveQuery, simulateTyping } from './test-utils.js';
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
} from './fixtures/libraries.js';
import { mockFetchEnLocalesSuccess } from './fixtures/locales.js';
import { mockFetchCardsPlainHTMLSuccess, mockFetchColumnsPlainHTMLSuccess } from './fixtures/blocks.js';

describe('FranklinLibrary', () => {
  beforeEach(() => {
    window.libraryDev = true;
    mockFetchEnLocalesSuccess();
    mockFetchSingleSheetLibrarySuccess();
    mockFetchMultiSheetLibrarySuccess();
    mockFetchCardsPlainHTMLSuccess();
    mockFetchColumnsPlainHTMLSuccess();
  });

  afterEach(() => {
    fetchMock.restore();
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

    picker.value = 'Foobar';
    picker.dispatchEvent(new Event('click'));

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

  it.skip('should search', async () => {
    AppModel.libraryHost = 'https://main--franklin-library-host--dylandepass.hlx.live/tools/sidekick/library';

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
    picker.value = 'tags';
    picker.dispatchEvent(new Event('change'));
    await waitUntil(
      () => recursiveQuery(library, '#tags-plugin'),
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
