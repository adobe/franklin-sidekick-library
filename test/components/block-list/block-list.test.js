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

import {
  html, fixture, expect, waitUntil, aTimeout,
} from '@open-wc/testing';
import { spy } from 'sinon';
import '../../../src/components/block-list/block-list.js';
import fetchMock from 'fetch-mock/esm/client';
import { createTag } from '../../../src/utils/dom.js';
import { CARDS_BLOCK_LIBRARY_ITEM, COLUMNS_BLOCK_LIBRARY_ITEM } from '../../fixtures/libraries.js';
import { mockFetchCardsPlainHTMLSuccess, mockFetchColumnsPlainHTMLSuccess } from '../../fixtures/blocks.js';
import { recursiveQuery } from '../../test-utils.js';

describe('BlockRenderer', () => {
  let blockList;
  let container;

  beforeEach(async () => {
    mockFetchColumnsPlainHTMLSuccess();
    mockFetchCardsPlainHTMLSuccess({ name: 'Cards Authored Name', searchTags: 'foobar' });
    blockList = await fixture(html`<block-list></block-list>`);
    container = createTag('div');
  });

  afterEach(() => {
    fetchMock.restore();
  });

  describe('loadBlocks', () => {
    it('renders correct list of block', async () => {
      blockList.loadBlocks([CARDS_BLOCK_LIBRARY_ITEM, COLUMNS_BLOCK_LIBRARY_ITEM], container);
      await waitUntil(
        () => recursiveQuery(blockList, 'sp-sidenav'),
        'Element did not render children',
      );
      const sideNav = recursiveQuery(blockList, 'sp-sidenav');
      const parentSideNavItems = sideNav.querySelectorAll(':scope > sp-sidenav-item');
      expect(parentSideNavItems.length).to.equal(2);
      const allSideNavItems = sideNav.querySelectorAll('sp-sidenav-item');
      expect(allSideNavItems.length).to.equal(6);
    });
    it('renders authored name', async () => {
      blockList.loadBlocks([CARDS_BLOCK_LIBRARY_ITEM, COLUMNS_BLOCK_LIBRARY_ITEM], container);
      await waitUntil(
        () => recursiveQuery(blockList, 'sp-sidenav'),
        'Element did not render children',
      );
      const sideNav = recursiveQuery(blockList, 'sp-sidenav');
      const authoredCardName = sideNav.querySelector('sp-sidenav-item[label="Cards Authored Name"]');
      expect(authoredCardName).to.exist;
    });
    it('preview block', async () => {
      const previewSpy = spy();

      blockList.loadBlocks([CARDS_BLOCK_LIBRARY_ITEM], container);
      await waitUntil(
        () => recursiveQuery(blockList, 'sp-sidenav'),
        'Element did not render children',
      );

      blockList.addEventListener('PreviewBlock', previewSpy);
      await aTimeout(1000);
      const sideNav = recursiveQuery(blockList, 'sp-sidenav');
      const navItem = sideNav.querySelector('sp-sidenav-item:first-of-type');
      navItem.dispatchEvent(new Event('OnAction'));
      expect(previewSpy.calledOnce).to.be.true;
    });

    it('no blocks', async () => {
      blockList.loadBlocks([], container);
      await waitUntil(
        () => recursiveQuery(blockList, 'sp-sidenav'),
        'Element did not render children',
      );

      const sideNav = recursiveQuery(blockList, 'sp-sidenav');
      const navItems = sideNav.querySelectorAll('sp-sidenav-item');
      expect(navItems.length).to.equal(0);
    });
    it('search', async () => {
      blockList.loadBlocks([CARDS_BLOCK_LIBRARY_ITEM], container);
      await waitUntil(
        () => recursiveQuery(blockList, 'sp-sidenav'),
        'Element did not render children',
      );

      blockList.filterBlocks('columns');

      const sideNav = recursiveQuery(blockList, 'sp-sidenav');
      let navItemResults = sideNav.querySelectorAll('sp-sidenav-item:not([aria-hidden])');
      expect(navItemResults.length).to.equal(0);

      blockList.filterBlocks('cards');
      navItemResults = sideNav.querySelectorAll('sp-sidenav-item:not([aria-hidden])');
      expect(navItemResults.length).to.equal(3);

      blockList.filterBlocks('foobar');
      navItemResults = sideNav.querySelectorAll('sp-sidenav-item:not([aria-hidden])');
      expect(navItemResults.length).to.equal(2);

      blockList.filterBlocks('not there');
      navItemResults = sideNav.querySelectorAll('sp-sidenav-item:not([aria-hidden])');
      expect(navItemResults.length).to.equal(0);

      blockList.filterBlocks('');
      navItemResults = sideNav.querySelectorAll('sp-sidenav-item:not([aria-hidden])');
      expect(navItemResults.length).to.equal(3);

      blockList.filterBlocks('logo');
      navItemResults = sideNav.querySelectorAll('sp-sidenav-item:not([aria-hidden])');
      expect(navItemResults.length).to.equal(2);
    });
  });
});
