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
  fixture, expect, waitUntil, aTimeout,
} from '@open-wc/testing';
import { recursiveQuery, simulateTyping } from './test-utils.js';
import AppModel from '../src/models/app-model.js';
import { unloadPlugin } from '../src/utils/plugin.js';
import '../src/index.js';
import '../src/plugins/blocks/blocks.js';

const singleSheetPath = 'https://main--helix-test-content-onedrive--adobe.hlx.page/block-library-tests/library-single-sheet.json';
const multiSheetPath = 'https://main--helix-test-content-onedrive--adobe.hlx.page/block-library-tests/library-multi-sheet.json';
const unknownPluginPath = 'https://main--helix-test-content-onedrive--adobe.hlx.page/block-library-tests/library-unknown-plugin.json';

describe('FranklinLibrary', () => {
  beforeEach(() => {
    window.libraryDev = true;
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
  });

  it('loads single sheet', async () => {
    const library = document.createElement('sidekick-library');
    library.config = {
      base: singleSheetPath,
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
      base: singleSheetPath,
      extends: multiSheetPath,
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
      base: multiSheetPath,
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
    const library = document.createElement('sidekick-library');
    library.config = {
      base: unknownPluginPath,
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
    const library = document.createElement('sidekick-library');
    library.config = {
      base: unknownPluginPath,
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
      base: singleSheetPath,
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
    const library = document.createElement('sidekick-library');
    library.config = {
      base: multiSheetPath,
    };

    await fixture(library);

    await waitUntil(
      () => recursiveQuery(library, 'sp-sidenav-item'),
      'Element did not render children',
    );

    const taxonomyItem = recursiveQuery(library, 'sp-menu-item[value="taxonomy"]');
    taxonomyItem.dispatchEvent(new Event('click'));

    await waitUntil(
      () => recursiveQuery(library, 'sp-sidenav-item'),
      'Element did not render children',
    );

    const searchButton = recursiveQuery(library, '#search-button');
    searchButton.dispatchEvent(new Event('click'));

    await waitUntil(
      () => recursiveQuery(library, 'input'),
      'Element did not render children',
    );

    const input = recursiveQuery(library, 'sp-search');

    await aTimeout(1000);
    await simulateTyping(input, 'Authored Name');
    input.dispatchEvent(new Event('input'));

    const pluginRenderer = recursiveQuery(library, 'plugin-renderer');

    await waitUntil(
      () => recursiveQuery(pluginRenderer, 'sp-sidenav-item'),
      'Element did not render children',
    );

    const pluginSideNav = recursiveQuery(pluginRenderer, 'sp-sidenav');
    const items = pluginSideNav.querySelectorAll('sp-sidenav-item');
    expect([...items].length).to.equal(2);
  }).timeout(5000);
});
