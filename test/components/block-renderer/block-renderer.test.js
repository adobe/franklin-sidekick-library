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
  html, fixture, expect, aTimeout, waitUntil,
} from '@open-wc/testing';
import '../../../src/components/block-renderer/block-renderer.js';
import { stub } from 'sinon';
import { sendKeys } from '@web/test-runner-commands';
import AppModel from '../../../src/models/app-model.js';
import {
  ALL_EDITABLE_ELEMENTS, CARDS, IMAGE,
} from './fixures.js';
import { recursiveQuery } from '../../test-utils.js';

describe('BlockRenderer', () => {
  let blockRenderer;

  const renderCardsBlock = async (blockRendererMethod) => {
    const cardsBlockName = 'cards';
    const cardsBlockData = {
      url: 'https://main--helix-test-content-onedrive--adobe.hlx.page/block-library-tests/blocks/cards/cards',
      extended: false,
    };

    await blockRendererMethod.loadBlock(cardsBlockName, cardsBlockData, CARDS);
  };

  const renderAllEditable = async (blockRendererMethod) => {
    const allEditableBlockName = 'all-editable-elements';
    const allEditableBlockData = {
      url: 'https://example.com/blocks/cards',
      extended: false,
    };

    await blockRendererMethod.loadBlock(
      allEditableBlockName,
      allEditableBlockData,
      ALL_EDITABLE_ELEMENTS,
    );
  };

  beforeEach(async () => {
    AppModel.init();
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
    blockRenderer = await fixture(html`<block-renderer></block-renderer>`);
  });

  afterEach(() => {
    blockRenderer = null;
  });

  describe('getBlockElement', () => {
    it('returns the block element', () => {
      renderCardsBlock(blockRenderer);
      const blockElement = blockRenderer.getBlockElement();
      expect(blockElement).to.exist;
      expect(blockElement.tagName).to.equal('DIV');
      expect(blockElement.getAttribute('class')).to.eq('cards sidekick-library');
    });
  });

  describe('getBlockWrapper', () => {
    it('returns the block wrapper', () => {
      renderCardsBlock(blockRenderer);
      const blockWrapper = blockRenderer.getBlockWrapper();
      expect(blockWrapper).to.exist;
      expect(blockWrapper.tagName).to.equal('DIV');
      expect(blockWrapper.getAttribute('class')).to.not.exist;
    });
  });

  describe('getBlockData', () => {
    it('returns the block data', () => {
      renderCardsBlock(blockRenderer);
      const blockData = blockRenderer.getBlockData();
      expect(blockData).to.exist;
      expect(blockData).to.deep.equal({
        url: 'https://main--helix-test-content-onedrive--adobe.hlx.page/block-library-tests/blocks/cards/cards',
        extended: false,
      });
    });
  });

  describe('decorateEditableElements', () => {
    it('check for contenteditable and data-library-id', () => {
      renderAllEditable(blockRenderer);
      const blockElement = blockRenderer.getBlockElement();
      blockElement.querySelectorAll('li, a, h1, h2, h3, h4, h5, h6').forEach((el) => {
        expect(el.getAttribute('contenteditable')).to.equal('true');
        expect(el.getAttribute('data-library-id')).to.not.be.null;
      });

      // Check for button
      blockElement.querySelectorAll('a').forEach((el) => {
        const up = el.parentElement;
        const twoup = el.parentElement.parentElement;

        const isUpSingleNodeP = up.childNodes.length === 1 && up.tagName === 'P';
        const isTwoUpSingleNodeP = twoup.childNodes.length === 1 && twoup.tagName === 'P';
        const isTwoUpSingleNodeDiv = twoup.childNodes.length === 1 && twoup.tagName === 'DIV';
        const isUpSingleNodeStrong = up.childNodes.length === 1 && up.tagName === 'STRONG';
        const isUpSingleNodeEm = up.childNodes.length === 1 && up.tagName === 'EM';

        if (isUpSingleNodeP
          || (isTwoUpSingleNodeP && isUpSingleNodeStrong)
          || (isTwoUpSingleNodeDiv && isUpSingleNodeP)
          || (isTwoUpSingleNodeP && isUpSingleNodeEm)) {
          expect(up.getAttribute('contenteditable')).to.equal(null);
          expect(up.getAttribute('data-library-id')).to.be.null;
          expect(twoup.getAttribute('contenteditable')).to.equal(null);
          expect(twoup.getAttribute('data-library-id')).to.be.null;
        }
      });

      // Paragraphs that are TEXT_NODE
      blockElement.querySelectorAll('p').forEach((el) => {
        if (el.nodeType === 3) {
          expect(el.getAttribute('contenteditable')).to.equal('true');
          expect(el.getAttribute('data-library-id')).to.not.be.null;
        }
      });

      // Strong that are TEXT_NODE
      blockElement.querySelectorAll('strong').forEach((el) => {
        if (el.nodeType === 3) {
          expect(el.getAttribute('contenteditable')).to.equal('true');
          expect(el.getAttribute('data-library-id')).to.not.be.null;
        }
      });
    });
  });

  describe('loadBlock', () => {
    it('should load a block page', async () => {
      renderCardsBlock(blockRenderer);

      const iframe = blockRenderer.shadowRoot.querySelector('iframe');
      await waitUntil(
        () => recursiveQuery(iframe.contentDocument, '.cards'),
        'Element did not render children',
      );

      const cardsBlock = recursiveQuery(iframe.contentDocument, '.cards');
      expect(cardsBlock).to.exist;
    });
  });

  describe('editable content', () => {
    it('content should be editable', async () => {
      renderCardsBlock(blockRenderer);

      const iframe = blockRenderer.shadowRoot.querySelector('iframe');
      await waitUntil(
        () => recursiveQuery(iframe.contentDocument, '.cards'),
        'Element did not render children',
      );

      const cardsBlock = recursiveQuery(iframe.contentDocument, '.cards');
      expect(cardsBlock).to.exist;

      const strong = cardsBlock.querySelector('strong');
      strong.textContent = 'hello world';

      const p = cardsBlock.querySelector('p:nth-of-type(2)');
      p.focus();
      await sendKeys({
        type: 'hello world',
      });

      const img = cardsBlock.querySelector('img');
      img.src = IMAGE;
      await aTimeout(1000);
      const wrapper = blockRenderer.getBlockWrapper();
      const modifiedBlock = wrapper.querySelector('.cards');
      expect(modifiedBlock.querySelector('strong').textContent).to.equal('hello world');
      expect(modifiedBlock.querySelector('p:nth-of-type(2)').textContent).to.equal('hello worldHelix is the fastest way to publish, create, and serve websites');
      expect(modifiedBlock.querySelector('img').src).to.equal(IMAGE);
    });

    describe('enableImageDragDrop', () => {
      it('drag events', async () => {
        renderCardsBlock(blockRenderer);

        const iframe = blockRenderer.shadowRoot.querySelector('iframe');
        await waitUntil(
          () => recursiveQuery(iframe.contentDocument, '.cards'),
          'Element did not render children',
        );

        const cardsBlock = recursiveQuery(iframe.contentDocument, '.cards');
        expect(cardsBlock).to.exist;

        const img = cardsBlock.querySelector('img');
        img.dispatchEvent(new Event('dragover', { target: img }));
        expect(img.style.outline).to.equal('rgb(84, 163, 246) solid 4px');
        expect(img.style.outlineRadius).to.equal('8px');

        const readerStub = {
          readAsDataURL: stub(),
          result: IMAGE,
          addEventListener: stub(),
        };

        stub(window, 'FileReader').returns(readerStub);

        const dropEvent = new Event('drop');

        // Set properties on the event object if needed
        dropEvent.dataTransfer = {
          files: [new File([], 'test.png')],
        };

        readerStub.addEventListener.withArgs('loadend').callsArg(1);
        img.dispatchEvent(dropEvent);
        expect(img.style.outline).to.equal('initial');
        expect(img.style.outlineRadius).to.equal('initial');
        expect(img.src).to.equal(IMAGE);

        img.dispatchEvent(new Event('dragleave', { target: img }));
        expect(img.style.outline).to.equal('initial');
        expect(img.style.outlineRadius).to.equal('initial');
        await aTimeout(1000);
      });
    });
  });
});
