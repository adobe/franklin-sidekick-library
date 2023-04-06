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

import { html, fixture, expect } from '@open-wc/testing';
import { stub } from 'sinon';
import '../../../src/views/library-list/library-list.js';
import { EventBus } from '../../../src/events/eventbus.js';
import { LIBRARY_LOADED } from '../../../src/events/events.js';

describe('LibraryList', () => {
  let component;

  beforeEach(async () => {
    component = await fixture(html`<library-list></library-list>`);
  });

  describe('connectedCallback', () => {
    it('should add an event listener for LIBRARY_LOADED events', () => {
      const addEventListenerSpy = stub(EventBus.instance, 'addEventListener');
      component.connectedCallback();

      expect(addEventListenerSpy).to.have.been.calledOnceWith(LIBRARY_LOADED);
      addEventListenerSpy.restore();
    });
  });

  describe('renderLibraries', () => {
    it('should render the libraries as sp-sidenav-items', async () => {
      component.libraries = { blocks: {}, taxonomy: {} };
      await component.updateComplete;

      const sidenavItems = component.shadowRoot.querySelectorAll('sp-sidenav-item');
      expect(sidenavItems).to.have.length(2);
      expect(sidenavItems[0].getAttribute('value')).to.equal('blocks');
      expect(sidenavItems[1].getAttribute('value')).to.equal('taxonomy');
    });

    it('should return an empty string if there are no libraries', async () => {
      const result = component.renderLibraries();
      expect(result).to.equal('');
    });
  });

  describe('render', () => {
    it('should render a sp-sidenav element with the libraries', async () => {
      component.libraries = { blocks: {}, taxonomy: {} };
      await component.updateComplete;

      const sidenav = component.shadowRoot.querySelector('sp-sidenav');
      expect(sidenav).to.exist;
      expect(sidenav.children).to.have.length(2);
    });
  });
});
