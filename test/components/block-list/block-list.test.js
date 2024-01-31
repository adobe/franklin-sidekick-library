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
import {
  CARDS_BLOCK_LIBRARY_ITEM, COLUMNS_BLOCK_LIBRARY_ITEM, MIXED_LIBRARY_ITEM, TEMPLATE_LIBRARY_ITEM,
} from '../../fixtures/libraries.js';
import {
  mockFetchCardsPlainHTMLWithMetadataSuccess,
  mockFetchColumnsPlainHTMLSuccess,
  mockFetchMixedBlockPlainHTMLSuccess,
  mockFetchTemplatePlainHTMLSuccess,
} from '../../fixtures/blocks.js';
import { recursiveQuery } from '../../test-utils.js';

describe('BlockRenderer', () => {
  let blockList;
  let container;

  beforeEach(async () => {
    mockFetchColumnsPlainHTMLSuccess();
    mockFetchTemplatePlainHTMLSuccess();
    mockFetchMixedBlockPlainHTMLSuccess();
    mockFetchCardsPlainHTMLWithMetadataSuccess({ name: 'Cards Authored Name', searchTags: 'foobar' });
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
      await blockList.loadBlocks([CARDS_BLOCK_LIBRARY_ITEM, COLUMNS_BLOCK_LIBRARY_ITEM], container);
      await waitUntil(
        () => recursiveQuery(blockList, 'sp-sidenav'),
        'Element did not render children',
      );
      const sideNav = recursiveQuery(blockList, 'sp-sidenav');
      const authoredCardName = sideNav.querySelector('sp-sidenav-item[label="Cards Authored Name"]');
      expect(authoredCardName).to.exist;
    });

    it('default library metadata', async () => {
      await blockList.loadBlocks([CARDS_BLOCK_LIBRARY_ITEM], container);
      await waitUntil(
        () => recursiveQuery(blockList, 'sp-sidenav'),
        'Element did not render children',
      );

      const sideNav = recursiveQuery(blockList, 'sp-sidenav');
      const authoredCardName = sideNav.querySelector('sp-sidenav-item[label="Cards Authored Name"]');
      expect(authoredCardName).to.exist;
      expect(authoredCardName.getAttribute('data-search-tags')).to.equal('foobar');

      const blockWithDefaultSearchTags = sideNav.querySelector('sp-sidenav-item[label="cards (logos)"]');
      expect(blockWithDefaultSearchTags).to.exist;
      expect(blockWithDefaultSearchTags.getAttribute('data-search-tags')).to.equal('Default Search Tag');
    });

    it('multiple templates should live under a single templates parent', async () => {
      await blockList.loadBlocks([TEMPLATE_LIBRARY_ITEM, TEMPLATE_LIBRARY_ITEM], container);
      await waitUntil(
        () => recursiveQuery(blockList, 'sp-sidenav'),
        'Element did not render children',
      );

      const sideNav = recursiveQuery(blockList, 'sp-sidenav');
      const templatesList = sideNav.querySelectorAll('sp-sidenav-item[label="Templates"]');
      expect(templatesList).to.exist;
      expect(templatesList.length).to.equal(1);
    });

    it('blocks and compound blocks in the same item should have the correct type (compoundBlock) set in section metadata', async () => {
      const loadBlockSpy = spy();
      await blockList.loadBlocks([MIXED_LIBRARY_ITEM], container);
      blockList.addEventListener('LoadBlock', loadBlockSpy);

      await waitUntil(
        () => recursiveQuery(blockList, 'sp-sidenav'),
        'Element did not render children',
      );

      const sideNav = recursiveQuery(blockList, 'sp-sidenav');
      const compoundBlock = sideNav.querySelector('sp-sidenav-item[label="Compound Block 1"]');
      expect(compoundBlock).to.exist;

      compoundBlock.dispatchEvent(new Event('click'));
      expect(loadBlockSpy.args[0][0].detail.sectionLibraryMetadata.compoundBlock).to.be.true;

      const columnsBlock = sideNav.querySelector('sp-sidenav-item[label="columns"]');
      expect(columnsBlock).to.exist;

      columnsBlock.dispatchEvent(new Event('click'));
      expect(loadBlockSpy.args[1][0].detail.sectionLibraryMetadata.compoundBlock).to.be.false;
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

    it('templates sorted alphabetically', async () => {
      const template1 = {
        ...TEMPLATE_LIBRARY_ITEM,
        name: 'A Template',
      };

      const template2 = {
        ...TEMPLATE_LIBRARY_ITEM,
        name: 'x Template',
      };

      const template3 = {
        ...TEMPLATE_LIBRARY_ITEM,
        name: '1 Template',
      };

      const template4 = {
        ...TEMPLATE_LIBRARY_ITEM,
        name: 'f Template',
      };

      blockList.loadBlocks([template1, template2, template3, template4], container);
      await waitUntil(
        () => recursiveQuery(blockList, 'sp-sidenav'),
        'Element did not render children',
      );

      const sideNav = recursiveQuery(blockList, 'sp-sidenav');
      const templatesSideNavItem = sideNav.querySelector('sp-sidenav-item[label="Templates"]');
      const childTemplates = templatesSideNavItem.querySelectorAll('sp-sidenav-item');

      expect(childTemplates[0].getAttribute('label')).to.equal('1 Template');
      expect(childTemplates[1].getAttribute('label')).to.equal('A Template');
      expect(childTemplates[2].getAttribute('label')).to.equal('f Template');
      expect(childTemplates[3].getAttribute('label')).to.equal('x Template');
    });
  });
});
