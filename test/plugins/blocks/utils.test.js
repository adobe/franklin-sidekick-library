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

import { expect } from '@open-wc/testing';
import sinon from 'sinon';
import {
  getBlockName,
  normalizeBlockName,
  convertBlockToTable,
  getBlockTableStyle,
  getPreferedBackgroundColor,
  getPreferedForegroundColor,
  getSectionMetadataFromAttributes,
  copyBlockToClipboard,
  copyDefaultContentToClipboard,
  copyPageToClipboard,
} from '../../../src/plugins/blocks/utils.js';
import { createTag } from '../../../src/utils/dom.js';
import { mockBlock } from '../../fixtures/blocks.js';
import { CARDS_DEFAULT_STUB, CARDS_WITH_ALIGNMENT_STUB } from '../../fixtures/stubs/cards.js';

describe('Blocks Util', () => {
  describe('getBlockName()', () => {
    it('returns the block name without variants', async () => {
      const cardsBlock = mockBlock(CARDS_DEFAULT_STUB);
      const blockName = getBlockName(cardsBlock, false);
      expect(blockName).to.equal('cards');
    });

    it('returns the block name with variants', async () => {
      const cardsBlock = mockBlock(CARDS_DEFAULT_STUB, ['variant1', 'variant2']);
      const blockName = getBlockName(cardsBlock, true);
      expect(blockName).to.equal('cards (variant1, variant2)');
    });

    it('returns the block name with variants & sidekick-library', async () => {
      const cardsBlock = mockBlock(CARDS_DEFAULT_STUB, ['variant1', 'variant2', 'sidekick-library']);
      const blockName = getBlockName(cardsBlock, true);
      expect(blockName).to.equal('cards (variant1, variant2)');
    });

    it('returns the block name with variants=true but no variants', async () => {
      const cardsBlock = mockBlock(CARDS_DEFAULT_STUB);
      const blockName = getBlockName(cardsBlock, true);
      expect(blockName).to.equal('cards');
    });
  });
  describe('normalizeBlockName()', () => {
    it('returns author friendly names', async () => {
      expect(normalizeBlockName('hero-main')).to.equal('Hero Main');
      expect(normalizeBlockName('hero-main (layer-1)')).to.equal('Hero Main (layer 1)');
      expect(normalizeBlockName('hero-main (layer-1, bold-italic)')).to.equal('Hero Main (layer 1, bold italic)');
      expect(normalizeBlockName('hero-main-foo-bar (layer-1, bold-italic, underline)')).to.equal('Hero Main Foo Bar (layer 1, bold italic, underline)');
    });
  });

  describe('convertBlockToTable()', () => {
    it('should preserve data-align & data-valign', async () => {
      const cardsBlock = mockBlock(CARDS_WITH_ALIGNMENT_STUB);
      const table = await convertBlockToTable({}, cardsBlock, 'cards', 'https://localhost:3000');
      const firstDataRow = table.querySelector('tr:nth-of-type(2)');
      expect(firstDataRow.querySelector('td:first-of-type').getAttribute('data-align')).to.equal('center');
      expect(firstDataRow.querySelector('td:first-of-type').getAttribute('data-valign')).to.equal('middle');

      const secondDataRow = table.querySelector('tr:nth-of-type(3)');
      expect(secondDataRow.querySelector('td:first-of-type').getAttribute('data-align')).to.equal('center');
      expect(secondDataRow.querySelector('td:nth-of-type(2)').getAttribute('data-align')).to.equal('center');

      const thirdDataRow = table.querySelector('tr:nth-of-type(4)');
      expect(thirdDataRow.querySelector('td:first-of-type').getAttribute('data-valign')).to.equal('middle');
      expect(thirdDataRow.querySelector('td:nth-of-type(2)').getAttribute('data-valign')).to.equal('middle');
    });
  });

  describe('convertBlockToTable()', () => {
    it('should preserve data-align & data-valign', async () => {
      const cardsBlock = mockBlock(CARDS_WITH_ALIGNMENT_STUB);
      const table = await convertBlockToTable({}, cardsBlock, 'cards', 'https://localhost:3000');
      const firstDataRow = table.querySelector('tr:nth-of-type(2)');
      expect(firstDataRow.querySelector('td:first-of-type').getAttribute('data-align')).to.equal('center');
      expect(firstDataRow.querySelector('td:first-of-type').getAttribute('data-valign')).to.equal('middle');

      const secondDataRow = table.querySelector('tr:nth-of-type(3)');
      expect(secondDataRow.querySelector('td:first-of-type').getAttribute('data-align')).to.equal('center');
      expect(secondDataRow.querySelector('td:nth-of-type(2)').getAttribute('data-align')).to.equal('center');

      const thirdDataRow = table.querySelector('tr:nth-of-type(4)');
      expect(thirdDataRow.querySelector('td:first-of-type').getAttribute('data-valign')).to.equal('middle');
      expect(thirdDataRow.querySelector('td:nth-of-type(2)').getAttribute('data-valign')).to.equal('middle');
    });
  });

  describe('getBlockTableStyle', () => {
    it('prefers section library metadata over default library metadata', () => {
      const defaultMetadata = {
        tableheaderbackgroundcolor: 'red',
        tableheaderforegroundcolor: 'blue',
      };
      const sectionMetadata = {
        tableheaderbackgroundcolor: 'green',
        tableheaderforegroundcolor: 'yellow',
      };
      const result = getBlockTableStyle(defaultMetadata, sectionMetadata);
      expect(result).to.deep.equal({
        tableHeaderBackgroundColor: 'green',
        tableHeaderForegroundColor: 'yellow',
      });
    });

    it('falls back to default library metadata if section library metadata is missing', () => {
      const defaultMetadata = {
        tableheaderbackgroundcolor: 'red',
        tableheaderforegroundcolor: 'blue',
      };
      const sectionMetadata = {};
      const result = getBlockTableStyle(defaultMetadata, sectionMetadata);
      expect(result).to.deep.equal({
        tableHeaderBackgroundColor: 'red',
        tableHeaderForegroundColor: 'blue',
      });
    });

    it('returns an empty object if both metadata objects are missing the properties', () => {
      const defaultMetadata = {};
      const sectionMetadata = {};
      const result = getBlockTableStyle(defaultMetadata, sectionMetadata);
      expect(result).to.be.empty;
    });
  });

  describe('getPreferedBackgroundColor', () => {
    it('returns the correct color for "section metadata" block', () => {
      document.documentElement.style.setProperty('--sk-section-metadata-table-background-color', '#123456');
      expect(getPreferedBackgroundColor('Section Metadata')).to.equal('#123456');
    });

    it('returns the correct color for "metadata" block', () => {
      document.documentElement.style.setProperty('--sk-metadata-table-background-color', '#654321');
      expect(getPreferedBackgroundColor('Metadata')).to.equal('#654321');
    });

    it('returns the correct color for an unspecified block', () => {
      document.documentElement.style.setProperty('--sk-block-table-background-color', '#abcdef');
      expect(getPreferedBackgroundColor('Some Other Block')).to.equal('#abcdef');
    });

    it('falls back to default color if the CSS variable is not set', () => {
      document.documentElement.style.removeProperty('--sk-section-metadata-table-background-color');
      document.documentElement.style.removeProperty('--sk-metadata-table-background-color');
      document.documentElement.style.removeProperty('--sk-block-table-background-color');
      expect(getPreferedBackgroundColor('Section Metadata')).to.equal('#ff8012');
    });
  });

  describe('getPreferedForegroundColor', () => {
    it('returns the correct color for "section metadata" block', () => {
      document.documentElement.style.setProperty('--sk-section-metadata-table-foreground-color', '#123456');
      expect(getPreferedForegroundColor('Section Metadata')).to.equal('#123456');
    });

    it('returns the correct color for "metadata" block', () => {
      document.documentElement.style.setProperty('--sk-metadata-table-foreground-color', '#654321');
      expect(getPreferedForegroundColor('Metadata')).to.equal('#654321');
    });

    it('returns the correct color for an unspecified block', () => {
      document.documentElement.style.setProperty('--sk-block-table-foreground-color', '#abcdef');
      expect(getPreferedForegroundColor('Some Other Block')).to.equal('#abcdef');
    });

    it('falls back to default color if the CSS variable is not set', () => {
      document.documentElement.style.removeProperty('--sk-section-metadata-table-foreground-color');
      document.documentElement.style.removeProperty('--sk-metadata-table-foreground-color');
      document.documentElement.style.removeProperty('--sk-block-table-foreground-color');
      expect(getPreferedForegroundColor('Section Metadata')).to.equal('#ffffff');
    });
  });

  describe('section metadata', () => {
    const BLOCK_URL = 'https://example.hlx.test/tools/sidekick/blocks/quote';
    const BLOCK_HTML = '<div class="quote dark"><div><div>Quote</div><div><p>Hello</p></div></div></div>';
    const LEGACY_SECTION_METADATA_HTML = '<div class="section-metadata"><div><div>Style</div><div>dark</div></div></div>';

    /**
     * Creates a section. When attributes are given the section has had its section metadata
     * applied by the server, otherwise the markup is the one the pipeline produces for
     * sites that process the section metadata on the client.
     */
    const createSection = (content, attributes = {}) => createTag('div', attributes, content);

    let clipboardStub;

    beforeEach(() => {
      clipboardStub = { write: sinon.stub().resolves() };
      Object.defineProperty(navigator, 'clipboard', { value: clipboardStub, configurable: true });
    });

    /**
     * Returns the html that was written to the clipboard as a container element
     */
    async function getClipboardContent() {
      const clipboardItem = clipboardStub.write.firstCall.args[0][0];
      const blob = await clipboardItem.getType('text/html');
      return createTag('div', undefined, await blob.text());
    }

    /**
     * Returns the rows of a table as an array of arrays of text
     */
    const getRows = table => [...table.querySelectorAll('tr')]
      .map(tr => [...tr.querySelectorAll('td')].map(td => td.textContent.trim()));

    describe('getSectionMetadataFromAttributes()', () => {
      it('returns undefined if the section has no attributes', () => {
        expect(getSectionMetadataFromAttributes(createSection(BLOCK_HTML))).to.be.undefined;
      });

      it('ignores attributes that are not section metadata', () => {
        const section = createSection(BLOCK_HTML, { lang: 'en', 'data-': 'foo' });
        expect(getSectionMetadataFromAttributes(section)).to.be.undefined;
      });

      it('ignores classes added by the library', () => {
        const section = createSection(BLOCK_HTML, { class: 'sidekick-library' });
        expect(getSectionMetadataFromAttributes(section)).to.be.undefined;
      });

      it('creates a section metadata block from class, id and data attributes', () => {
        const section = createSection(BLOCK_HTML, {
          class: 'bg-color-dark sidekick-library centered',
          id: 'get-started',
          'data-section-margin': '0',
          'data-logos': 'https://example.com/a.png,https://example.com/b.png',
        });

        const sectionMetadata = getSectionMetadataFromAttributes(section);
        expect(sectionMetadata.className).to.equal('section-metadata');
        const rows = [...sectionMetadata.children]
          .map(row => [...row.children].map(cell => cell.textContent));
        expect(rows).to.deep.equal([
          ['Style', 'bg-color-dark, centered'],
          ['Id', 'get-started'],
          ['section-margin', '0'],
          ['logos', 'https://example.com/a.png,https://example.com/b.png'],
        ]);
      });

      it('treats values as text', () => {
        const section = createSection(BLOCK_HTML, { 'data-heading': '<b>Heading</b>' });
        const sectionMetadata = getSectionMetadataFromAttributes(section);
        expect(sectionMetadata.querySelector('b')).to.be.null;
        expect(sectionMetadata.textContent).to.equal('heading<b>Heading</b>');
      });
    });

    describe('copyBlockToClipboard()', () => {
      it('copies section metadata block', async () => {
        const section = createSection(BLOCK_HTML + LEGACY_SECTION_METADATA_HTML);
        await copyBlockToClipboard({}, section, 'quote (dark)', BLOCK_URL);

        const tables = (await getClipboardContent()).querySelectorAll('table');
        expect(tables.length).to.equal(2);
        expect(getRows(tables[0])[0]).to.deep.equal(['Quote (dark)']);
        expect(getRows(tables[1])).to.deep.equal([['Section Metadata'], ['Style', 'dark']]);
      });

      it('copies section metadata applied to the section by the server', async () => {
        const section = createSection(BLOCK_HTML, {
          class: 'bg-color-brand-dark',
          'data-section-margin': '0',
        });
        await copyBlockToClipboard({}, section, 'quote (dark)', BLOCK_URL);

        const tables = (await getClipboardContent()).querySelectorAll('table');
        expect(tables.length).to.equal(2);
        expect(getRows(tables[0])[0]).to.deep.equal(['Quote (dark)']);
        expect(getRows(tables[1])).to.deep.equal([
          ['Section Metadata'],
          ['Style', 'bg-color-brand-dark'],
          ['section-margin', '0'],
        ]);
      });

      it('prefers the section metadata block over the section attributes', async () => {
        const section = createSection(BLOCK_HTML + LEGACY_SECTION_METADATA_HTML, { class: 'foo' });
        await copyBlockToClipboard({}, section, 'quote (dark)', BLOCK_URL);

        const tables = (await getClipboardContent()).querySelectorAll('table');
        expect(tables.length).to.equal(2);
        expect(getRows(tables[1])).to.deep.equal([['Section Metadata'], ['Style', 'dark']]);
      });

      it('does not copy section metadata if there is none', async () => {
        const section = createSection(BLOCK_HTML);
        await copyBlockToClipboard({}, section, 'quote (dark)', BLOCK_URL);

        const tables = (await getClipboardContent()).querySelectorAll('table');
        expect(tables.length).to.equal(1);
      });
    });

    describe('copyDefaultContentToClipboard()', () => {
      const DEFAULT_CONTENT_HTML = '<h1>Heading</h1><p>Some text</p>';

      it('copies section metadata block', async () => {
        const section = createSection(DEFAULT_CONTENT_HTML + LEGACY_SECTION_METADATA_HTML);
        await copyDefaultContentToClipboard({}, section, BLOCK_URL);

        const content = await getClipboardContent();
        expect(content.querySelector('.section-metadata')).to.be.null;
        expect(content.querySelector('h1').textContent).to.equal('Heading');
        const tables = content.querySelectorAll('table');
        expect(tables.length).to.equal(1);
        expect(getRows(tables[0])).to.deep.equal([['Section Metadata'], ['Style', 'dark']]);
      });

      it('copies section metadata applied to the section by the server', async () => {
        const section = createSection(DEFAULT_CONTENT_HTML, {
          class: 'sidekick-library highlight',
          'data-background': 'blue',
        });
        await copyDefaultContentToClipboard({}, section, BLOCK_URL);

        const content = await getClipboardContent();
        expect(content.querySelector('h1').textContent).to.equal('Heading');
        const tables = content.querySelectorAll('table');
        expect(tables.length).to.equal(1);
        expect(getRows(tables[0])).to.deep.equal([
          ['Section Metadata'],
          ['Style', 'highlight'],
          ['background', 'blue'],
        ]);
      });

      it('does not copy section metadata if there is none', async () => {
        const section = createSection(DEFAULT_CONTENT_HTML, { class: 'sidekick-library' });
        await copyDefaultContentToClipboard({}, section, BLOCK_URL);

        const content = await getClipboardContent();
        expect(content.querySelectorAll('table').length).to.equal(0);
      });
    });

    describe('copyPageToClipboard()', () => {
      it('copies section metadata of every section', async () => {
        const page = createTag('body', undefined, [
          // processed by the server
          createSection(BLOCK_HTML, { class: 'highlight', 'data-background': 'blue' }),
          // processed by the client
          createSection(BLOCK_HTML + LEGACY_SECTION_METADATA_HTML),
          // processed by the server, default content only
          createSection('<p>Some text</p>', { id: 'last' }),
          // no section metadata
          createSection(BLOCK_HTML),
        ]);
        await copyPageToClipboard({}, page, BLOCK_URL);

        const content = await getClipboardContent();
        const sections = [...content.querySelectorAll(':scope > div')];
        expect(sections.length).to.equal(4);

        // The section metadata is in the section, before the section delimiter
        expect(sections[0].querySelector('.section-metadata')).to.be.null;
        const firstSection = [...sections[0].children].map(el => (el.tagName === 'TABLE'
          ? el.querySelector('td').textContent
          : el.tagName));
        expect(firstSection).to.deep.equal(['Quote (dark)', 'BR', 'BR', 'Section Metadata', 'P']);
        expect(sections[0].lastElementChild.textContent).to.equal('---');
        expect(getRows(sections[0].querySelectorAll('table')[1])).to.deep.equal([
          ['Section Metadata'],
          ['Style', 'highlight'],
          ['background', 'blue'],
        ]);

        expect(getRows(sections[1].querySelectorAll('table')[1])).to.deep.equal([['Section Metadata'], ['Style', 'dark']]);
        expect(sections[1].lastElementChild.textContent).to.equal('---');

        // No block in the third section, the section metadata is added after the content
        expect(sections[2].querySelector('p').textContent).to.equal('Some text');
        expect(sections[2].lastElementChild.textContent).to.equal('---');
        expect(getRows(sections[2].querySelector('table'))).to.deep.equal([['Section Metadata'], ['Id', 'last']]);

        // The last section has no section metadata
        expect(sections[3].querySelectorAll('table').length).to.equal(1);
      });

      it('adds section metadata to the end of the last section', async () => {
        const page = createTag('body', undefined, createSection(BLOCK_HTML, { class: 'highlight' }));
        await copyPageToClipboard({}, page, BLOCK_URL);

        const section = (await getClipboardContent()).querySelector(':scope > div');
        expect(section.lastElementChild.tagName).to.equal('TABLE');
        expect(getRows(section.lastElementChild)).to.deep.equal([['Section Metadata'], ['Style', 'highlight']]);
      });
    });
  });
});
