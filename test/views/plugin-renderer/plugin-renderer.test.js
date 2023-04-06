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
import '../../../src/views/plugin-renderer/plugin-renderer.js';
import { spy } from 'sinon';
import {
  PLUGIN_LOADED, PLUGIN_UNLOADED, SEARCH_UPDATED, TOAST,
} from '../../../src/events/events.js';
import { EventBus } from '../../../src/events/eventbus.js';
import AppModel from '../../../src/models/app-model.js';

describe('PluginRenderer', () => {
  it('displays a progress container with a spinner when loaded', async () => {
    const el = await fixture(html`<plugin-renderer></plugin-renderer>`);
    expect(el.shadowRoot.querySelector('.progress-container')).to.exist;
    expect(el.shadowRoot.querySelector('sp-progress-circle')).to.exist;
    expect(el.shadowRoot.querySelector('.progress-container.visible')).to.not.exist;
    el.displayLoader();
    expect(el.shadowRoot.querySelector('.progress-container.visible')).to.exist;
  });

  it('hides the progress container with a spinner when unloaded', async () => {
    const el = await fixture(html`<plugin-renderer></plugin-renderer>`);
    el.displayLoader();
    expect(el.shadowRoot.querySelector('.progress-container.visible')).to.exist;
    el.hideLoader();
    expect(el.shadowRoot.querySelector('.progress-container.visible')).to.not.exist;
  });

  it('renders a root container when a plugin is loaded', async () => {
    AppModel.init();
    const el = await fixture(html`<plugin-renderer></plugin-renderer>`);
    expect(el.shadowRoot.querySelector('.root')).to.not.exist;
    AppModel.appStore.activePlugin = {
      title: 'Blocks',
      searchEnabled: true,
      decorate: () => {},
    };
    AppModel.appStore.activePluginPath = '../../src/plugins/blocks/blocks.js';

    const pluginLoadedEvent = new CustomEvent(PLUGIN_LOADED);
    EventBus.instance.dispatchEvent(pluginLoadedEvent);
    expect(el.shadowRoot.querySelector('.root')).to.exist;
  });

  describe('connectedCallback', () => {
    let element;

    beforeEach(async () => {
      element = await fixture(html`<plugin-renderer></plugin-renderer>`);
      AppModel.appStore.pluginData = { data: 'test data' };
      AppModel.appStore.activePlugin = { decorate: () => {} };
      AppModel.appStore.activePluginPath = '../../src/plugins/blocks/blocks.js';
    });

    afterEach(() => {
      EventBus.instance.listeners = [];
    });

    it('should listen for PLUGIN_LOADED event and call loadPluginStylesheet method', () => {
      const loadPluginStylesheetSpy = spy(element, 'loadPluginStylesheet');
      EventBus.instance.dispatchEvent(new CustomEvent(PLUGIN_LOADED));
      expect(loadPluginStylesheetSpy.calledOnce).to.be.true;
    });

    it('should listen for PLUGIN_LOADED event and add root div element with .root class', () => {
      EventBus.instance.dispatchEvent(new CustomEvent(PLUGIN_LOADED));
      const root = element.renderRoot.querySelector('.root');
      expect(root).to.exist;
      expect(root.tagName).to.equal('DIV');
      expect(root.classList.contains('root')).to.be.true;
    });

    it('should listen for PLUGIN_LOADED event and call decorate method with root element', () => {
      const decorateSpy = spy(AppModel.appStore.activePlugin, 'decorate');
      EventBus.instance.dispatchEvent(new CustomEvent(PLUGIN_LOADED));
      expect(decorateSpy.calledOnce).to.be.true;
    });

    it('should listen for PLUGIN_UNLOADED event and remove root div element with .root class', () => {
      const root = document.createElement('div');
      root.classList.add('root');
      element.renderRoot.appendChild(root);
      EventBus.instance.dispatchEvent(new CustomEvent(PLUGIN_UNLOADED));
      const removedRoot = element.renderRoot.querySelector('.root');
      expect(removedRoot).not.to.exist;
    });

    it('should listen for SEARCH_UPDATED event and call decorate method with root element, plugin data, and search query', () => {
      const decorateSpy = spy(AppModel.appStore.activePlugin, 'decorate');
      EventBus.instance.dispatchEvent(new CustomEvent(PLUGIN_LOADED));
      EventBus.instance.dispatchEvent(new CustomEvent(SEARCH_UPDATED));
      expect(decorateSpy.calledTwice).to.be.true;
    });
  });
  describe('sendToast()', () => {
    it('dispatches a custom event with the TOAST event type and event detail', async () => {
      const pluginRenderer = await fixture(html`<plugin-renderer></plugin-renderer>`);
      const toastDetail = { message: 'Hello, world!' };
      const toastSpy = spy(pluginRenderer, 'sendToast');
      pluginRenderer.addEventListener(TOAST, toastSpy);

      pluginRenderer.sendToast({ detail: toastDetail });

      expect(toastSpy).to.have.been.calledOnce;
      const toastEvent = toastSpy.getCall(0).args[0];
      expect(toastEvent.detail).to.deep.equal(toastDetail);
    });
  });
});
