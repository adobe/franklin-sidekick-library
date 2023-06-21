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

import '../../../src/views/plugin-renderer/plugin-renderer.js';
import '../../../src/components/block-list/block-list.js';
import '../../../src/components/block-renderer/block-renderer.js';
import '../../../src/components/split-view/split-view.js';
import { decorate } from '../../../src/plugins/blocks/blocks.js';
import { APP_EVENTS, PLUGIN_EVENTS } from '../../../src/events/events.js';
import { EventBus } from '../../../src/events/eventbus.js';
import AppModel from '../../../src/models/app-model.js';
import { simulateTyping } from '../../test-utils.js';

const CARDS = { name: 'Cards', url: 'https://main--helix-test-content-onedrive--adobe.hlx.live/block-library-tests/blocks/cards/cards', path: '/block-library-tests/blocks/cards/cards' };
const COLUMNS = { name: 'Columns', url: 'https://main--helix-test-content-onedrive--adobe.hlx.live/block-library-tests/blocks/columns/columns', path: '/block-library-tests/blocks/cards/cards' };
const NON_EXISTENT = { name: 'Columns', url: 'https://main--helix-test-content-onedrive--adobe.hlx.live/block-library-tests/blocks/columns/path-does-not-exist', path: '/block-library-tests/blocks/columns/path-does-not-exist' };

describe('Blocks Plugin', () => {
  describe('decorate()', () => {
    let container;

    const loadBlock = async () => {
      const loadBlockSpy = sinon.spy();
      const mockData = [CARDS];

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
      };

      const pluginLoadedEvent = new CustomEvent(APP_EVENTS.PLUGIN_LOADED);
      EventBus.instance.dispatchEvent(pluginLoadedEvent);
    });

    it('should render a list of blocks', async () => {
      const mockData = [CARDS];

      await decorate(container, mockData);

      const blockLibrary = container.querySelector('.block-library');
      const blocks = blockLibrary.querySelector('sp-split-view .menu .list-container block-list').shadowRoot.querySelectorAll('sp-sidenav-item');
      expect(blocks.length).to.equal(6);
      expect(blocks[0].getAttribute('label')).to.equal('Cards');
      expect(blocks[1].getAttribute('label')).to.equal('cards');
      expect(blocks[2].getAttribute('label')).to.equal('cards (logos)');
    });

    it('should render any valid path and ignore any invalid path', async () => {
      const mockData = [NON_EXISTENT, CARDS];

      await decorate(container, mockData);

      const blockLibrary = container.querySelector('.block-library');
      const blocks = blockLibrary.querySelector('sp-split-view .menu .list-container block-list').shadowRoot.querySelectorAll('sp-sidenav-item');
      expect(blocks.length).to.equal(6);
      expect(blocks[0].getAttribute('label')).to.equal('Cards');
      expect(blocks[1].getAttribute('label')).to.equal('cards');
      expect(blocks[2].getAttribute('label')).to.equal('cards (logos)');
    });

    it('should render a toast & empty results message if loading all blocks failed', async () => {
      const eventSpy = sinon.spy();
      const mockData = [NON_EXISTENT];

      container.addEventListener(PLUGIN_EVENTS.TOAST, eventSpy);
      await decorate(container, mockData);

      const blockLibrary = container.querySelector('.block-library');
      const blocks = blockLibrary.querySelector('sp-split-view .menu .list-container block-list').shadowRoot.querySelectorAll('sp-sidenav-item');
      expect(blocks.length).to.equal(0);

      expect(eventSpy.calledOnce).to.be.true;
    });

    it('should expand a block if it matches the query', async () => {
      const mockData = [CARDS, COLUMNS];

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
      const mockData = [CARDS, COLUMNS];

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
      const toastSpy = sinon.spy();
      const copyBlockSpy = sinon.spy();
      const mockData = [CARDS];

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

    it('load block', async () => {
      await loadBlock();
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
