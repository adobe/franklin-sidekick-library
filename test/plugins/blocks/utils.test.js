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
import { getBlockName, normalizeBlockName, convertBlockToTable } from '../../../src/plugins/blocks/utils.js';
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
      expect(normalizeBlockName('hero-main')).to.equal('hero main');
      expect(normalizeBlockName('hero-main (layer-1)')).to.equal('hero main (layer 1)');
      expect(normalizeBlockName('hero-main (layer-1, bold-italic)')).to.equal('hero main (layer 1, bold italic)');
      expect(normalizeBlockName('hero-main-foo-bar (layer-1, bold-italic, underline)')).to.equal('hero main foo bar (layer 1, bold italic, underline)');
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
});
