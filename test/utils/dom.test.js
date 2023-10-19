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
  createTag, getMetadata, loadCSS, readBlockConfig,
} from '../../src/utils/dom.js';

describe('Dom Util Tests', () => {
  describe('createTag', () => {
    let tag;
    let attributes;
    let html;

    beforeEach(() => {
      tag = 'div';
      attributes = { class: 'test', id: 'test-id' };
      html = '<p>Test</p>';
    });

    it('should create an element with the given tag and attributes', () => {
      const el = createTag(tag, attributes);
      expect(el.tagName).to.equal(tag.toUpperCase());
      expect(el.className).to.equal(attributes.class);
      expect(el.id).to.equal(attributes.id);
    });

    it('should create an element with the given HTML', () => {
      const el = createTag(tag, null, html);
      expect(el.innerHTML).to.equal(html);
    });

    it('should create an element with the given nested HTML elements', () => {
      const nestedHtml = ['<p>Nested 1</p>', '<p>Nested 2</p>'];
      const el = createTag(tag, null, nestedHtml);
      expect(el.childNodes.length).to.equal(nestedHtml.length);
      expect(el.innerHTML).to.equal('&lt;p&gt;Nested 1&lt;/p&gt;&lt;p&gt;Nested 2&lt;/p&gt;');
    });

    it('should create an element with the given document fragment', () => {
      const fragment = document.createDocumentFragment();
      const child = document.createElement('p');
      child.textContent = 'Test';
      fragment.appendChild(child);
      const el = createTag(tag, null, fragment);
      expect(el.innerHTML).to.equal('<p>Test</p>');
    });

    it('should create an element with the given SVG element', () => {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('width', '100');
      rect.setAttribute('height', '100');
      svg.appendChild(rect);
      const el = createTag(tag, null, svg);
      expect(el.innerHTML).to.equal(svg.outerHTML);
    });
  });

  describe('getMetadata', () => {
    it('Test empty element returns an empty object', () => {
      const emptyDiv = document.createElement('div');
      const emptyMetadata = getMetadata(emptyDiv);
      expect(Object.keys(emptyMetadata).length).equals(0);
    });
    it('Test element with metadata returns expected data', () => {
      const divWithMetadata = document.createElement('div');
      const row1 = document.createElement('div');
      const r1KeyDiv = document.createElement('div');
      r1KeyDiv.textContent = 'content';
      const r1ValueDiv = document.createElement('div');
      r1ValueDiv.textContent = 'abc';
      row1.append(r1KeyDiv);
      row1.append(r1ValueDiv);

      const row2 = document.createElement('div');
      const r2KeyDiv = document.createElement('div');
      r2KeyDiv.textContent = 'text';
      const r2ValueDiv = document.createElement('div');
      r2ValueDiv.textContent = 'test title';
      row2.append(r2KeyDiv);
      row2.append(r2ValueDiv);

      divWithMetadata.appendChild(row1);
      divWithMetadata.appendChild(row2);

      const expectedData = {
        content: {
          content: {},
          text: 'abc',
        },
        text: {
          content: {},
          text: 'test title',
        },
      };
      const actualData = getMetadata(divWithMetadata);

      expect(JSON.stringify(actualData)).equals(JSON.stringify(expectedData));
    });
    it('Test element with missing data returns only available data', () => {
      const divWithPartialMetadata = document.createElement('div');
      const authorRow = document.createElement('div');
      const authorKey = document.createElement('div');
      authorKey.textContent = 'Author';
      const authorValue = document.createElement('div');
      authorValue.textContent = 'Test Author';
      authorRow.appendChild(authorKey);
      authorRow.appendChild(authorValue);
      divWithPartialMetadata.appendChild(authorRow);
      const yearRow = document.createElement('div');
      const yearKey = document.createElement('div');
      yearKey.textContent = 'Year';
      yearRow.appendChild(yearKey);
      divWithPartialMetadata.appendChild(yearRow);

      const expectedPartialData = {
        author: {
          content: authorValue,
          text: 'test author',
        },
      };
      const actualPartialData = getMetadata(divWithPartialMetadata);
      expect(JSON.stringify(actualPartialData)).equals(JSON.stringify(expectedPartialData));
    });
  });

  describe('loadCSS', () => {
    let ogHead;
    const cssPath = '../../src/plugins/blocks/blocks.css';

    beforeEach(() => {
      ogHead = document.head.innerHTML;
    });
    afterEach(() => {
      document.head.innerHTML = ogHead;
    });

    it('should load a CSS file', (done) => {
      loadCSS(cssPath, (status) => {
        expect(status).to.equal('load');
        expect(document.querySelector(`head > link[href="${cssPath}"]`)).to.exist;
        done();
      });
    });

    it('should not load a CSS file that has already been loaded', (done) => {
      const link = document.createElement('link');
      link.setAttribute('rel', 'stylesheet');
      link.setAttribute('href', cssPath);
      document.head.appendChild(link);

      loadCSS(cssPath, (status) => {
        expect(status).to.equal('noop');
        expect(document.querySelectorAll(`head > link[href="${cssPath}"]`)).to.have.lengthOf(1);
        done();
      });
    });

    it('should call the callback function with the status', (done) => {
      loadCSS(cssPath, (status) => {
        expect(status).to.be.oneOf(['load', 'error']);
        done();
      });
    });

    it('should not load a CSS file that has already been loaded', (done) => {
      const link = document.createElement('link');
      link.setAttribute('rel', 'stylesheet');
      link.setAttribute('href', cssPath);
      document.head.appendChild(link);

      loadCSS(cssPath, (status) => {
        expect(status).to.equal('noop');
        expect(document.querySelectorAll(`head > link[href="${cssPath}"]`)).to.have.lengthOf(1);
        done();
      });
    });

    it('should call the callback function with the status', (done) => {
      loadCSS(cssPath, (status) => {
        expect(status).to.be.oneOf(['load', 'error']);
        done();
      });
    });
  });

  describe('readBlockConfig', () => {
    it('should ignore description properties', () => {
      const libraryMetadata = document.createElement('div');
      libraryMetadata.innerHTML = `
        <div>
          <div>name</div>
          <div>Z-Pattern (Author Agnostic)</div>
        </div>
        <div>
          <div>description</div>
          <div>
            <h3 id="author-agnostic">Author Agnostic</h3>
            <p>This means this and that</p>
            <p><a href="https://hlx.live">This is a link</a></p>
            <ul>
              <li>This is one thing</li>
              <li>This is the second thing</li>
              <li>This is the <em><u>third</u></em> thing</li>
            </ul>
          </div>
        </div>
      `;

      const config = readBlockConfig(libraryMetadata, false);
      expect(config.name).to.eq('Z-Pattern (Author Agnostic)');
      expect(config.description instanceof HTMLElement).to.eq(true);
    });

    it('should parse other types correctly', () => {
      const libraryMetadata = document.createElement('div');
      libraryMetadata.innerHTML = `
        <div>
          <div>webpage</div>
          <div>
            <a href="https://hlx.live">This is a link</a>
          </div>
        </div>
        <div>
          <div>hero</div>
          <div>
            <img src="https://hlx.live"></img>
          </div>
        </div>
        <div>
          <div>content</div>
          <div>
            <p>foo</p>
          </div>
        </div>
        <div>
          <div>fallback</div>
          <div>
            <p>bar</p>
          </div>
        </div>
      `;

      const config = readBlockConfig(libraryMetadata, false);
      expect(config.webpage).to.eq('https://hlx.live/');
      expect(config.hero).to.eq('https://hlx.live/');
      expect(config.content).to.eq('foo');
      expect(config.fallback).to.eq('bar');
    });
  });
});
