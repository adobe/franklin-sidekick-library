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
import {
  getBlockName,
  normalizeBlockName,
  convertBlockToTable,
  getBlockTableStyle,
  getPreferedBackgroundColor,
  getPreferedForegroundColor,
} from '../../../src/plugins/blocks/utils.js';
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
});
