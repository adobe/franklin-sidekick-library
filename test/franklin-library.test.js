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

import '../src/app.js';
import { recursiveQuery } from './test-utils.js';

describe('FranklinLibrary', () => {
  beforeEach(() => {
    window.libraryDev = true;
  });
  it('renders container', async () => {
    const element = await fixture(html`<franklin-library></franklin-library>`);
    const container = element.shadowRoot.querySelector('.container');
    await expect(container).to.not.be.null;
  });

  it('passes the a11y audit', async () => {
    const element = await fixture(html`<franklin-library></franklin-library>`);
    await expect(element).shadowDom.to.be.accessible();
  });

  it('loads single sheet', async () => {
    const library = document.createElement('franklin-library');
    library.config = {
      library: 'https://main--helix-test-content-onedrive--adobe.hlx.page/block-library-tests/library-single-sheet.json',
    };

    await fixture(library);

    await waitUntil(
      () => recursiveQuery(library, 'sp-sidenav-item'),
      'Element did not render children',
    );

    const sideNav = recursiveQuery(library, 'sp-sidenav');
    const items = sideNav.querySelectorAll('sp-sidenav-item');
    expect([...items].length).to.equal(1);
  });

  it('loads multi sheet', async () => {
    const library = document.createElement('franklin-library');
    library.config = {
      library: 'https://main--helix-test-content-onedrive--adobe.hlx.page/block-library-tests/library-multi-sheet.json',
    };

    await fixture(library);

    await waitUntil(
      () => recursiveQuery(library, 'sp-sidenav-item'),
      'Element did not render children',
    );

    const sideNav = recursiveQuery(library, 'sp-sidenav');
    const items = sideNav.querySelectorAll('sp-sidenav-item');
    expect([...items].length).to.equal(2);
  });

  it('unknown plugin', async () => {
    const library = document.createElement('franklin-library');
    library.config = {
      library: 'https://main--helix-test-content-onedrive--adobe.hlx.page/block-library-tests/library-unknown-plugin.json',
    };

    await fixture(library);

    await waitUntil(
      () => recursiveQuery(library, 'sp-sidenav-item'),
      'Element did not render children',
    );

    const sideNav = recursiveQuery(library, 'sp-sidenav');

    sideNav.dispatchEvent(new Event('click', {
      target: {
        value: 'Foobar',
      },
    }));

    const toast = recursiveQuery(library, 'sp-toast');
    expect(toast).to.be.visible;
    expect(toast.getAttribute('variant')).to.equal('negative');
  });
});
