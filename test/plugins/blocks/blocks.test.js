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

import sinon from 'sinon';
import {
  html, fixture, expect, waitUntil,
} from '@open-wc/testing';
import '@spectrum-web-components/search/sp-search.js';
import '@spectrum-web-components/action-button/sp-action-button.js';
import fetchMock from 'fetch-mock/esm/client';
import '../../../src/views/plugin-renderer/plugin-renderer.js';
import '../../../src/components/block-list/block-list.js';
import '../../../src/components/block-renderer/block-renderer.js';
import '../../../src/components/split-view/split-view.js';
import { copyBlockToClipboard, copyDefaultContentToClipboard } from '../../../src/plugins/blocks/utils.js';
import { decorate } from '../../../src/plugins/blocks/blocks.js';
import { APP_EVENTS, PLUGIN_EVENTS } from '../../../src/events/events.js';
import { EventBus } from '../../../src/events/eventbus.js';
import AppModel from '../../../src/models/app-model.js';
import { simulateTyping } from '../../test-utils.js';
import {
  addSectionMetadata,
  cardsBlockUrl,
  defaultContentBlockUrl,
  mockBlock,
  mockFetchCardsPlainHTMLSuccess,
  mockFetchCardsPlainHTMLWithDefaultLibraryMetadataSuccess,
  mockFetchColumnsPlainHTMLSuccess,
  mockFetchDefaultContentPlainHTMLSuccess,
  mockFetchTabsPlainHTMLSuccess,
  mockFetchNonExistantPlainHTMLFailure,
  mockFetchCompoundBlockPlainHTMLSuccess,
  mockFetchTemplatePlainHTMLSuccess,
} from '../../fixtures/blocks.js';
import {
  CARDS_BLOCK_LIBRARY_ITEM,
  COLUMNS_BLOCK_LIBRARY_ITEM,
  COMPOUND_BLOCK_LIBRARY_ITEM,
  DEFAULT_CONTENT_LIBRARY_ITEM,
  NON_EXISTENT_BLOCK_LIBRARY_ITEM,
  TABS_LIBRARY_ITEM,
  TEMPLATE_LIBRARY_ITEM,
} from '../../fixtures/libraries.js';
import {
  mockFetchCardsDocumentSuccess,
  mockFetchCompoundBlockDocumentSuccess,
  mockFetchDefaultContentDocumentSuccess,
  mockFetchInlinePageDependenciesSuccess,
  mockFetchTabsDocumentSuccess,
  mockFetchTemplateDocumentSuccess,
} from '../../fixtures/pages.js';
import { DEFAULT_CONTENT_STUB_WITH_SECTION_METADATA } from '../../fixtures/stubs/default-content.js';
import { CARDS_DEFAULT_STUB } from '../../fixtures/stubs/cards.js';
import { createTag } from '../../../src/utils/dom.js';

describe('Blocks Plugin', () => {
  describe('decorate()', () => {
    let container;

    const loadBlock = async () => {
      mockFetchCardsPlainHTMLWithDefaultLibraryMetadataSuccess({ description: 'foobar' });
      mockFetchCardsDocumentSuccess();
      mockFetchInlinePageDependenciesSuccess();

      const loadBlockSpy = sinon.spy();
      const mockData = [CARDS_BLOCK_LIBRARY_ITEM];

      await decorate(container, mockData);
      const blockLibrary = container.querySelector('.block-library');
      const blockList = blockLibrary.querySelector('sp-split-view .menu .list-container block-list');
      blockList.addEventListener('LoadBlock', loadBlockSpy);

      const sidenav = blockList.shadowRoot.querySelector(':scope sp-sidenav');

      const cardsItem = sidenav.querySelector(':scope > sp-sidenav-item[label="Cards"]');
      const firstCardChild = cardsItem.querySelector(':scope > sp-sidenav-item');
      firstCardChild.dispatchEvent(new Event('click'));

      expect(loadBlockSpy.calledOnce).to.be.true;

      const blockRenderer = blockLibrary.querySelector('sp-split-view .content .view .frame-view block-renderer');
      await waitUntil(
        () => blockRenderer.shadowRoot.querySelector('iframe'),
        'Element did not render children',
      );

      const iframe = blockRenderer.shadowRoot.querySelector('iframe');
      expect(iframe).to.not.be.null;

      await waitUntil(
        () => iframe.contentDocument.querySelector('main .cards'),
        'Element did not render children',
      );

      const cards = iframe.contentDocument.querySelector('main .cards');
      expect(cards).to.not.be.null;

      const detailsContainer = blockLibrary.querySelector('sp-split-view .content .details-container .details');
      expect(detailsContainer.textContent).to.eq('foobar');
    };

    const loadDefaultContent = async () => {
      mockFetchDefaultContentPlainHTMLSuccess();
      mockFetchDefaultContentDocumentSuccess();
      mockFetchInlinePageDependenciesSuccess();

      const loadBlockSpy = sinon.spy();
      const mockData = [DEFAULT_CONTENT_LIBRARY_ITEM];

      await decorate(container, mockData);
      const blockLibrary = container.querySelector('.block-library');
      const blockList = blockLibrary.querySelector('sp-split-view .menu .list-container block-list');
      blockList.addEventListener('LoadBlock', loadBlockSpy);

      const sidenav = blockList.shadowRoot.querySelector(':scope sp-sidenav');

      const item = sidenav.querySelector(':scope > sp-sidenav-item[label="Default Content"]');
      const firstCardChild = item.querySelector(':scope > sp-sidenav-item');
      firstCardChild.dispatchEvent(new Event('click'));

      expect(loadBlockSpy.calledOnce).to.be.true;

      const blockRenderer = blockLibrary.querySelector('sp-split-view .content .view .frame-view block-renderer');
      await waitUntil(
        () => blockRenderer.shadowRoot.querySelector('iframe'),
        'Element did not render children',
      );

      const iframe = blockRenderer.shadowRoot.querySelector('iframe');
      expect(iframe).to.not.be.null;

      await waitUntil(
        () => iframe.contentDocument.querySelector('#this-is-a-heading'),
        'Element did not render children',
      );

      const heading = iframe.contentDocument.querySelector('#this-is-a-heading');
      expect(heading).to.not.be.null;

      const img = iframe.contentDocument.querySelector('img');
      expect(img.src).to.eq('https://example.hlx.test/media_1dda29fc47b8402ff940c87a2659813e503b01d2d.png?width=750&format=png&optimize=medium');

      const p = iframe.contentDocument.querySelector('p:nth-of-type(2)');
      expect(p.getAttribute('contenteditable')).to.eq('true');
      expect(p.getAttribute('data-library-id')).to.not.be.null;
    };

    const loadMultiSectionContent = async () => {
      mockFetchTabsPlainHTMLSuccess();
      mockFetchTabsDocumentSuccess();
      mockFetchInlinePageDependenciesSuccess();

      const loadBlockSpy = sinon.spy();
      const mockData = [TABS_LIBRARY_ITEM];

      await decorate(container, mockData);
      const blockLibrary = container.querySelector('.block-library');
      const blockList = blockLibrary.querySelector('sp-split-view .menu .list-container block-list');
      blockList.addEventListener('LoadBlock', loadBlockSpy);

      const sidenav = blockList.shadowRoot.querySelector(':scope sp-sidenav');

      const item = sidenav.querySelector(':scope > sp-sidenav-item[label="Tabs"]');
      const firstCardChild = item.querySelector(':scope > sp-sidenav-item');
      firstCardChild.dispatchEvent(new Event('click'));

      expect(loadBlockSpy.calledOnce).to.be.true;

      const blockRenderer = blockLibrary.querySelector('sp-split-view .content .view .frame-view block-renderer');
      await waitUntil(
        () => blockRenderer.shadowRoot.querySelector('iframe'),
        'Element did not render children',
      );

      const iframe = blockRenderer.shadowRoot.querySelector('iframe');
      expect(iframe).to.not.be.null;

      await waitUntil(
        () => iframe.contentDocument.querySelector('div.tabs'),
        'Element did not render children',
      );

      const img = iframe.contentDocument.querySelector('img');
      expect(img.src).to.eq('https://example.hlx.test/media_1ec4de4b5a7398fdbeb9a2150fb69acc74100e0d0.png?width=750&format=png&optimize=medium');
    };

    const loadCompoundBlockContent = async () => {
      mockFetchCompoundBlockPlainHTMLSuccess();
      mockFetchCompoundBlockDocumentSuccess();
      mockFetchInlinePageDependenciesSuccess();

      const loadBlockSpy = sinon.spy();
      const mockData = [COMPOUND_BLOCK_LIBRARY_ITEM];

      await decorate(container, mockData);
      const blockLibrary = container.querySelector('.block-library');
      const blockList = blockLibrary.querySelector('sp-split-view .menu .list-container block-list');
      blockList.addEventListener('LoadBlock', loadBlockSpy);

      const sidenav = blockList.shadowRoot.querySelector(':scope sp-sidenav');

      const item = sidenav.querySelector(':scope > sp-sidenav-item[label="Compound Block"]');
      const firstCardChild = item.querySelector(':scope > sp-sidenav-item');
      firstCardChild.dispatchEvent(new Event('click'));

      expect(loadBlockSpy.calledOnce).to.be.true;

      const blockRenderer = blockLibrary.querySelector('sp-split-view .content .view .frame-view block-renderer');
      await waitUntil(
        () => blockRenderer.shadowRoot.querySelector('iframe'),
        'Element did not render children',
      );

      const iframe = blockRenderer.shadowRoot.querySelector('iframe');
      expect(iframe).to.not.be.null;

      await waitUntil(
        () => iframe.contentDocument.querySelector('div.z-pattern'),
        'Element did not render children',
      );

      const img = iframe.contentDocument.querySelector('img');
      expect(img.src).to.eq('https://example.hlx.test/media_1ec4de4b5a7398fdbeb9a2150fb69acc74100e0d0.png?width=750&format=png&optimize=medium');
    };

    const loadTemplateContent = async () => {
      mockFetchTemplatePlainHTMLSuccess();
      mockFetchTemplateDocumentSuccess();
      mockFetchInlinePageDependenciesSuccess();

      const loadBlockSpy = sinon.spy();
      const mockData = [TEMPLATE_LIBRARY_ITEM];

      await decorate(container, mockData);
      const blockLibrary = container.querySelector('.block-library');
      const blockList = blockLibrary.querySelector('sp-split-view .menu .list-container block-list');
      blockList.addEventListener('LoadBlock', loadBlockSpy);

      const sidenav = blockList.shadowRoot.querySelector(':scope sp-sidenav');

      const item = sidenav.querySelector(':scope > sp-sidenav-item[label="Templates"]');
      const firstCardChild = item.querySelector(':scope > sp-sidenav-item');
      firstCardChild.dispatchEvent(new Event('click'));

      const blockRenderer = blockLibrary.querySelector('sp-split-view .content .view .frame-view block-renderer');
      await waitUntil(
        () => blockRenderer.shadowRoot.querySelector('iframe'),
        'Element did not render children',
      );

      const iframe = blockRenderer.shadowRoot.querySelector('iframe');
      expect(iframe).to.not.be.null;

      await waitUntil(
        () => iframe.contentDocument.querySelector('.blockquote'),
        'Element did not render children',
      );

      const img = iframe.contentDocument.querySelector('img');
      expect(img.src).to.eq('https://example.hlx.test/media_1e24f72d6bb08f4cec2618ef688691fe591e57746.jpeg?width=750&format=jpeg&optimize=medium');
    };

    beforeEach(async () => {
      AppModel.init();
      container = await fixture(html`<plugin-renderer></plugin-renderer>`);
      AppModel.appStore.context = {
        activePlugin: {
          config: {
            title: 'Blocks',
            searchEnabled: true,
          },
          decorate: () => {},
          path: '../../src/plugins/blocks/blocks.js',
        },
        baseLibraryOrigin: 'https://example.hlx.test',
      };

      window.blocks = { cards: CARDS_BLOCK_LIBRARY_ITEM };

      const pluginLoadedEvent = new CustomEvent(APP_EVENTS.PLUGIN_LOADED);
      EventBus.instance.dispatchEvent(pluginLoadedEvent);
    });

    afterEach(() => {
      fetchMock.restore();
    });

    it('should render a list of blocks', async () => {
      const mockData = [CARDS_BLOCK_LIBRARY_ITEM, COLUMNS_BLOCK_LIBRARY_ITEM];
      mockFetchCardsPlainHTMLSuccess();
      mockFetchColumnsPlainHTMLSuccess();
      await decorate(container, mockData);

      const blockLibrary = container.querySelector('.block-library');
      const blocks = blockLibrary.querySelector('sp-split-view .menu .list-container block-list').shadowRoot.querySelectorAll('sp-sidenav-item');
      expect(blocks.length).to.equal(6);
      expect(blocks[0].getAttribute('label')).to.equal('Cards');
      expect(blocks[1].getAttribute('label')).to.equal('cards');
    });

    it('should render any valid path and ignore any invalid path', async () => {
      mockFetchCardsPlainHTMLSuccess();
      mockFetchColumnsPlainHTMLSuccess();
      mockFetchNonExistantPlainHTMLFailure();
      const mockData = [
        NON_EXISTENT_BLOCK_LIBRARY_ITEM,
        CARDS_BLOCK_LIBRARY_ITEM,
        COLUMNS_BLOCK_LIBRARY_ITEM,
      ];
      await decorate(container, mockData);

      const blockLibrary = container.querySelector('.block-library');
      const blocks = blockLibrary.querySelector('sp-split-view .menu .list-container block-list').shadowRoot.querySelectorAll('sp-sidenav-item');
      expect(blocks.length).to.equal(6);
      expect(blocks[0].getAttribute('label')).to.equal('Cards');
      expect(blocks[1].getAttribute('label')).to.equal('cards');
    });

    it('should render a toast & empty results message if loading all blocks failed', async () => {
      const eventSpy = sinon.spy();
      const mockData = [NON_EXISTENT_BLOCK_LIBRARY_ITEM];

      container.addEventListener(PLUGIN_EVENTS.TOAST, eventSpy);
      await decorate(container, mockData);

      const blockLibrary = container.querySelector('.block-library');
      const blocks = blockLibrary.querySelector('sp-split-view .menu .list-container block-list').shadowRoot.querySelectorAll('sp-sidenav-item');
      expect(blocks.length).to.equal(0);

      expect(eventSpy.calledOnce).to.be.true;
    });

    it('should expand a block if it matches the query', async () => {
      mockFetchCardsPlainHTMLSuccess();
      mockFetchColumnsPlainHTMLSuccess();
      const mockData = [CARDS_BLOCK_LIBRARY_ITEM, COLUMNS_BLOCK_LIBRARY_ITEM];

      await decorate(container, mockData);
      const blockLibrary = container.querySelector('.block-library');

      const spSearch = blockLibrary.querySelector('sp-split-view .menu .search sp-search');
      await simulateTyping(spSearch, 'Cards');
      spSearch.dispatchEvent(new Event('input'));

      const sidenav = blockLibrary.querySelector('sp-split-view .menu .list-container block-list').shadowRoot.querySelector(':scope sp-sidenav');
      const cardsItem = sidenav.querySelector(':scope > sp-sidenav-item[label="Cards"]');
      expect(cardsItem.getAttribute('expanded')).to.exist;

      const columns = sidenav.querySelector(':scope > sp-sidenav-item[label="Columns"]');
      expect(columns.getAttribute('expanded')).to.not.exist;
      expect(columns.getAttribute('aria-hidden')).to.eq('true');
    });

    it('should render no results if no matches to the query', async () => {
      mockFetchCardsPlainHTMLSuccess();
      mockFetchColumnsPlainHTMLSuccess();
      const mockData = [CARDS_BLOCK_LIBRARY_ITEM, COLUMNS_BLOCK_LIBRARY_ITEM];

      await decorate(container, mockData);

      const blockLibrary = container.querySelector('.block-library');
      const spSearch = blockLibrary.querySelector('sp-split-view .menu .search sp-search');
      await simulateTyping(spSearch, 'foobar');
      spSearch.dispatchEvent(new Event('input'));

      const sidenav = blockLibrary.querySelector('sp-split-view .menu .list-container block-list').shadowRoot.querySelector(':scope sp-sidenav');

      const cardsItem = sidenav.querySelector(':scope > sp-sidenav-item[label="Cards"]');
      expect(cardsItem.getAttribute('aria-hidden')).to.eq('true');

      const columns = sidenav.querySelector(':scope > sp-sidenav-item[label="Columns"]');
      expect(columns.getAttribute('aria-hidden')).to.eq('true');
    });

    it('should copy block from block-list', async () => {
      mockFetchCardsPlainHTMLSuccess();
      const toastSpy = sinon.spy();
      const copyBlockSpy = sinon.spy();
      const mockData = [CARDS_BLOCK_LIBRARY_ITEM];

      await decorate(container, mockData);
      const blockLibrary = container.querySelector('.block-library');
      const blockList = blockLibrary.querySelector('sp-split-view .menu .list-container block-list');
      blockList.addEventListener('CopyBlock', copyBlockSpy);
      container.addEventListener('Toast', toastSpy);

      const sidenav = blockList.shadowRoot.querySelector(':scope sp-sidenav');

      const cardsItem = sidenav.querySelector(':scope > sp-sidenav-item[label="Cards"]');
      const firstCardChild = cardsItem.querySelector(':scope > sp-sidenav-item');
      firstCardChild.dispatchEvent(new Event('OnAction'));

      expect(copyBlockSpy.calledOnce).to.be.true;
      expect(toastSpy.calledOnce).to.be.true;
    });

    it('should copy default content from block-list', async () => {
      mockFetchDefaultContentPlainHTMLSuccess();
      const toastSpy = sinon.spy();
      const copyBlockSpy = sinon.spy();
      const mockData = [DEFAULT_CONTENT_LIBRARY_ITEM];

      await decorate(container, mockData);
      const blockLibrary = container.querySelector('.block-library');
      const blockList = blockLibrary.querySelector('sp-split-view .menu .list-container block-list');
      blockList.addEventListener('CopyBlock', copyBlockSpy);
      container.addEventListener('Toast', toastSpy);

      const sidenav = blockList.shadowRoot.querySelector(':scope sp-sidenav');
      const cardsItem = sidenav.querySelector(':scope > sp-sidenav-item[label="Default Content"]');
      const firstCardChild = cardsItem.querySelector(':scope > sp-sidenav-item');
      firstCardChild.dispatchEvent(new Event('OnAction'));

      expect(copyBlockSpy.calledOnce).to.be.true;
      expect(toastSpy.calledOnce).to.be.true;
    });

    it('should copy multi section block from block-list', async () => {
      mockFetchTabsPlainHTMLSuccess();
      const toastSpy = sinon.spy();
      const copyBlockSpy = sinon.spy();
      const mockData = [TABS_LIBRARY_ITEM];

      await decorate(container, mockData);
      const blockLibrary = container.querySelector('.block-library');
      const blockList = blockLibrary.querySelector('sp-split-view .menu .list-container block-list');
      blockList.addEventListener('CopyBlock', copyBlockSpy);
      container.addEventListener('Toast', toastSpy);

      const sidenav = blockList.shadowRoot.querySelector(':scope sp-sidenav');

      const tabsItem = sidenav.querySelector(':scope > sp-sidenav-item[label="Tabs"]');
      const firstCardChild = tabsItem.querySelector(':scope > sp-sidenav-item');
      firstCardChild.dispatchEvent(new Event('OnAction'));

      expect(copyBlockSpy.calledOnce).to.be.true;
      expect(toastSpy.calledOnce).to.be.true;

      const copiedHTML = createTag('div', undefined, toastSpy.firstCall.args[0].detail.result);
      expect(copiedHTML.querySelectorAll(':scope > div').length).to.eq(4);
      expect(copiedHTML.querySelectorAll(':scope table').length).to.eq(5);
      expect(copiedHTML.querySelector(':scope h2').textContent).to.eq('Heading');
      expect(copiedHTML.querySelectorAll(':scope ol li').length).to.eq(3);
      expect(copiedHTML.querySelector('img').src).to.eq('https://example.hlx.test/media_1ec4de4b5a7398fdbeb9a2150fb69acc74100e0d0.png?width=750&format=png&optimize=medium');
    });

    it('should copy compound block from block-list', async () => {
      mockFetchCompoundBlockPlainHTMLSuccess();
      const toastSpy = sinon.spy();
      const copyBlockSpy = sinon.spy();
      const mockData = [COMPOUND_BLOCK_LIBRARY_ITEM];

      await decorate(container, mockData);
      const blockLibrary = container.querySelector('.block-library');
      const blockList = blockLibrary.querySelector('sp-split-view .menu .list-container block-list');
      blockList.addEventListener('CopyBlock', copyBlockSpy);
      container.addEventListener('Toast', toastSpy);

      const sidenav = blockList.shadowRoot.querySelector(':scope sp-sidenav');

      const tabsItem = sidenav.querySelector(':scope > sp-sidenav-item[label="Compound Block"]');
      const firstCardChild = tabsItem.querySelector(':scope > sp-sidenav-item');
      firstCardChild.dispatchEvent(new Event('OnAction'));

      expect(copyBlockSpy.calledOnce).to.be.true;
      expect(toastSpy.calledOnce).to.be.true;

      const copiedHTML = createTag('div', undefined, toastSpy.firstCall.args[0].detail.result);

      expect(copiedHTML.querySelectorAll(':scope > div').length).to.eq(1);
      expect(copiedHTML.querySelectorAll(':scope table').length).to.eq(3);
      expect(copiedHTML.querySelector('table:nth-of-type(1) tr td').textContent).to.eq('z-pattern');
      expect(copiedHTML.querySelector('table:nth-of-type(2) tr td').textContent).to.eq('banner (small, left)');
      expect(copiedHTML.querySelector('table:nth-of-type(3) tr td').textContent).to.eq('Section metadata');
    });

    it('should copy template from block-list', async () => {
      mockFetchTemplatePlainHTMLSuccess();
      const toastSpy = sinon.spy();
      const copyBlockSpy = sinon.spy();
      const mockData = [TEMPLATE_LIBRARY_ITEM];

      await decorate(container, mockData);
      const blockLibrary = container.querySelector('.block-library');
      const blockList = blockLibrary.querySelector('sp-split-view .menu .list-container block-list');
      blockList.addEventListener('CopyBlock', copyBlockSpy);
      container.addEventListener('Toast', toastSpy);

      const sidenav = blockList.shadowRoot.querySelector(':scope sp-sidenav');

      const tabsItem = sidenav.querySelector(':scope > sp-sidenav-item[label="Templates"]');
      const firstCardChild = tabsItem.querySelector(':scope > sp-sidenav-item');
      firstCardChild.dispatchEvent(new Event('OnAction'));

      expect(copyBlockSpy.calledOnce).to.be.true;
      expect(toastSpy.calledOnce).to.be.true;

      const copiedHTML = createTag('div', undefined, toastSpy.firstCall.args[0].detail.result);
      expect(copiedHTML.querySelectorAll(':scope > div').length).to.eq(2);
      expect(copiedHTML.querySelectorAll(':scope table').length).to.eq(3);
      expect(copiedHTML.querySelector('table:nth-of-type(1) tr td').textContent).to.eq('blockquote');
      expect(copiedHTML.querySelector('table:nth-of-type(2) tr td').textContent).to.eq('Section metadata');

      // eslint-disable-next-line max-len
      // expect(copiedHTML.querySelector('table:nth-of-type(2) tr td').textContent).to.eq('Metadata');

      // Not sure why I had to do this.. makes no sense..
      // There should be 3 tables as per assert above.
      copiedHTML.querySelectorAll(':scope table').forEach((table, index) => {
        if (index === 2) {
          expect(table.querySelector('tr td').textContent).to.eq('Metadata');
        }
      });
    });

    it('copy block via details panel', async () => {
      const toastSpy = sinon.spy();
      await loadBlock();

      const blockLibrary = container.querySelector('.block-library');
      container.addEventListener('Toast', toastSpy);

      const actionBar = blockLibrary.querySelector('sp-split-view .content .details-container .action-bar');
      const copyButton = actionBar.querySelector('sp-button');
      copyButton.dispatchEvent(new Event('click'));

      expect(toastSpy.calledOnce).to.be.true;

      const copiedHTML = createTag('div', undefined, toastSpy.firstCall.args[0].detail.result);
      expect(copiedHTML.querySelector('p:first-of-type').textContent).to.eq('Unmatched speed');

      const firstImage = copiedHTML.querySelector('img');
      expect(firstImage.src).to.eq('https://example.hlx.test/media_1.jpeg?width=750&format=jpeg&optimize=medium');
      expect(firstImage.width).to.eq(270);
      expect(firstImage.height).to.eq(153);
    });

    it('copy default content via details panel', async () => {
      const toastSpy = sinon.spy();
      await loadDefaultContent();

      const blockLibrary = container.querySelector('.block-library');
      container.addEventListener('Toast', toastSpy);

      const actionBar = blockLibrary.querySelector('sp-split-view .content .details-container .action-bar');
      const copyButton = actionBar.querySelector('sp-button');
      copyButton.dispatchEvent(new Event('click'));

      expect(toastSpy.calledOnce).to.be.true;

      const copiedHTML = createTag('div', undefined, toastSpy.firstCall.args[0].detail.result);
      expect(copiedHTML.querySelector('h1').textContent).to.eq('This is a heading');
      expect(copiedHTML.querySelector('p:last-of-type').textContent).to.eq(':home:');
      expect(copiedHTML.querySelector('img').src).to.eq('https://example.hlx.test/media_1dda29fc47b8402ff940c87a2659813e503b01d2d.png?width=750&format=png&optimize=medium');
    });

    it('copy multi section block via details panel', async () => {
      const toastSpy = sinon.spy();
      await loadMultiSectionContent();

      const blockLibrary = container.querySelector('.block-library');
      container.addEventListener('Toast', toastSpy);

      const actionBar = blockLibrary.querySelector('sp-split-view .content .details-container .action-bar');
      const copyButton = actionBar.querySelector('sp-button');
      copyButton.dispatchEvent(new Event('click'));

      expect(toastSpy.calledOnce).to.be.true;

      const copiedHTML = createTag('div', undefined, toastSpy.firstCall.args[0].detail.result);
      expect(copiedHTML.querySelectorAll(':scope > div').length).to.eq(4);
      expect(copiedHTML.querySelectorAll(':scope table').length).to.eq(5);
      expect(copiedHTML.querySelector(':scope h2').textContent).to.eq('Heading');
      expect(copiedHTML.querySelectorAll(':scope ol li').length).to.eq(3);
      expect(copiedHTML.querySelector('img').src).to.eq('https://example.hlx.test/media_1ec4de4b5a7398fdbeb9a2150fb69acc74100e0d0.png?width=750&format=png&optimize=medium');
    });

    it('copy compound block via details panel', async () => {
      const toastSpy = sinon.spy();
      await loadCompoundBlockContent();

      const blockLibrary = container.querySelector('.block-library');
      container.addEventListener('Toast', toastSpy);

      const actionBar = blockLibrary.querySelector('sp-split-view .content .details-container .action-bar');
      const copyButton = actionBar.querySelector('sp-button');
      copyButton.dispatchEvent(new Event('click'));

      expect(toastSpy.calledOnce).to.be.true;

      const copiedHTML = createTag('div', undefined, toastSpy.firstCall.args[0].detail.result);
      expect(copiedHTML.querySelectorAll(':scope > div').length).to.eq(1);
      expect(copiedHTML.querySelectorAll(':scope table').length).to.eq(3);
      expect(copiedHTML.querySelector(':scope h2').textContent).to.eq('Heading');
      expect(copiedHTML.querySelector('img').src).to.eq('https://example.hlx.test/media_1ec4de4b5a7398fdbeb9a2150fb69acc74100e0d0.png?width=750&format=png&optimize=medium');
      expect(copiedHTML.querySelector('table:nth-of-type(1) tr td').textContent).to.eq('z-pattern');
      expect(copiedHTML.querySelector('table:nth-of-type(2) tr td').textContent).to.eq('banner (small, left)');
      expect(copiedHTML.querySelector('table:nth-of-type(3) tr td').textContent).to.eq('Section metadata');
    });

    it('copy template via details panel', async () => {
      const toastSpy = sinon.spy();
      await loadTemplateContent();

      const blockLibrary = container.querySelector('.block-library');
      container.addEventListener('Toast', toastSpy);

      const actionBar = blockLibrary.querySelector('sp-split-view .content .details-container .action-bar');
      const copyButton = actionBar.querySelector('sp-button');
      copyButton.dispatchEvent(new Event('click'));

      expect(toastSpy.calledOnce).to.be.true;

      const copiedHTML = createTag('div', undefined, toastSpy.firstCall.args[0].detail.result);
      expect(copiedHTML.querySelectorAll(':scope > div').length).to.eq(2);
      expect(copiedHTML.querySelectorAll(':scope table').length).to.eq(3);
      expect(copiedHTML.querySelector(':scope h1').textContent).to.eq('My blog post about a subject');
      expect(copiedHTML.querySelector('img').src).to.eq('https://example.hlx.test/media_1e24f72d6bb08f4cec2618ef688691fe591e57746.jpeg?width=750&format=jpeg&optimize=medium');
      expect(copiedHTML.querySelector('table:nth-of-type(1) tr td').textContent).to.eq('blockquote');
      expect(copiedHTML.querySelector('table:nth-of-type(2) tr td').textContent).to.eq('Section metadata');

      // See above for this sillyness
      copiedHTML.querySelectorAll(':scope table').forEach((table, index) => {
        if (index === 2) {
          expect(table.querySelector('tr td').textContent).to.eq('Metadata');
        }
      });
    });

    it('copyBlockToClipboard', async () => {
      const defaultCardsBlock = mockBlock(CARDS_DEFAULT_STUB, [], true);
      addSectionMetadata(defaultCardsBlock, { style: 'dark' });

      const wrapper = defaultCardsBlock;
      const copied = copyBlockToClipboard(wrapper, 'cards', cardsBlockUrl);
      const copiedHTML = createTag('div', undefined, copied);
      const copiedMetadata = createTag('div', undefined, copiedHTML.querySelector('table:nth-of-type(2)'));

      const img = wrapper.querySelector('img');
      expect(img.src).to.eq('https://example.hlx.test/media_1.jpeg?width=750&format=jpeg&optimize=medium');

      const spanIcon = wrapper.querySelector('span.icon');
      expect(spanIcon).to.be.null;

      const sectionMetadata = wrapper.querySelector('.section-metadata');
      expect(sectionMetadata).to.not.be.null;

      expect(copiedHTML.querySelector('img').src).to.eq('https://example.hlx.test/media_1.jpeg?width=750&format=jpeg&optimize=medium');
      expect(copiedHTML.querySelector('table')).to.not.be.null;
      expect(copiedHTML.querySelector('td:nth-of-type(2)').style.width).to.eq('50%');

      expect(copiedMetadata.querySelector('td:nth-of-type(1)').textContent).to.eq('Section metadata');
      expect(copiedMetadata.querySelector('tr:nth-of-type(2) td:nth-of-type(1)').textContent).to.eq('style');
      expect(copiedMetadata.querySelector('tr:nth-of-type(2) td:nth-of-type(2)').textContent).to.eq('dark');
    });

    it('copyDefaultContentToClipboard', async () => {
      const wrapper = DEFAULT_CONTENT_STUB_WITH_SECTION_METADATA;
      const url = new URL(defaultContentBlockUrl);

      const copied = copyDefaultContentToClipboard(wrapper, url);
      const copiedHTML = createTag('div', undefined, copied);
      const copiedMetadata = createTag('div', undefined, copiedHTML.querySelector('table'));

      expect(copiedHTML.querySelector('img').src).to.eq('https://example.hlx.test/media_1dda29fc47b8402ff940c87a2659813e503b01d2d.png?width=750&format=png&optimize=medium');
      expect(copiedHTML.querySelector('p:last-of-type').textContent).to.eq(':home:');

      expect(copiedMetadata.querySelector('td:nth-of-type(1)').textContent).to.eq('Section metadata');
      expect(copiedMetadata.querySelector('tr:nth-of-type(2) td:nth-of-type(1)').textContent).to.eq('name');
      expect(copiedMetadata.querySelector('tr:nth-of-type(2) td:nth-of-type(2)').textContent).to.eq('Home Hero');
    });

    it('switch iframe view sizes', async () => {
      await loadBlock();

      const blockLibrary = container.querySelector('.block-library');

      const actionBar = blockLibrary.querySelector('sp-split-view .content .view .action-bar');
      const tableViewButton = actionBar.querySelector('sp-action-button[value="tablet"]');
      tableViewButton.dispatchEvent(new Event('click'));

      const frameView = blockLibrary.querySelector('.frame-view');
      expect(frameView.style.width).to.eq('768px');

      const mobileViewButton = actionBar.querySelector('sp-action-button[value="mobile"]');
      mobileViewButton.dispatchEvent(new Event('click'));

      expect(frameView.style.width).to.eq('480px');

      const desktopViewButton = actionBar.querySelector('sp-action-button[value="desktop"]');
      desktopViewButton.dispatchEvent(new Event('click'));

      expect(frameView.style.width).to.eq('100%');
    });
  });
});
