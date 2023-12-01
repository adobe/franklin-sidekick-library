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
import { LitElement, html, css } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import { createTag } from '../../utils/dom.js';
import { EventBus } from '../../events/eventbus.js';
import { APP_EVENTS, PLUGIN_EVENTS } from '../../events/events.js';
import AppModel from '../../models/app-model.js';

export class PluginRenderer extends LitElement {
  progressContainer = createRef();

  static styles = css`
    sp-sidenav {
      width: 100%;
    }

    .progress-container {
      position: absolute;
      width: 100%;
      height: 100%;
      display: flex;
      top: 0;
      align-items: center;
      justify-content: center;
      display: none;
    }

    .progress-container.visible {
      display: flex;
    }

    .plugin-root {
      height: 100%;
      overflow-y: auto;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    EventBus.instance.addEventListener(APP_EVENTS.PLUGIN_LOADED, async () => {
      const root = createTag('div', { class: 'plugin-root', 'data-testid': 'plugin-root' });
      this.renderRoot.prepend(root);

      // Load the stylesheet for the plugin
      await this.loadPluginStylesheet();

      root.addEventListener(PLUGIN_EVENTS.SHOW_LOADER, this.displayLoader.bind(this));
      root.addEventListener(PLUGIN_EVENTS.TOAST, this.sendToast);
      root.addEventListener(PLUGIN_EVENTS.HIDE_LOADER, this.hideLoader.bind(this));

      const { context } = AppModel.appStore;
      const { activePlugin } = context;
      const pluginConfig = context.plugins
        ? context.plugins[activePlugin.config.title.toLowerCase()] : {};

      activePlugin.decorate(
        root,
        activePlugin.data,
        AppModel.appStore.searchQuery,
        pluginConfig,
      );

      // Set the id of the render root element to the plugin name
      root.setAttribute('id', `${activePlugin.config.title.toLowerCase()}-plugin`);
    });

    EventBus.instance.addEventListener(APP_EVENTS.PLUGIN_UNLOADED, () => {
      const root = this.renderRoot.querySelector('.plugin-root');
      if (root) {
        // Hide if left loading
        this.hideLoader();
        root.remove();
      }
    });

    EventBus.instance.addEventListener(APP_EVENTS.SEARCH_UPDATED, () => {
      const root = this.renderRoot.querySelector('.plugin-root');
      if (root) {
        root.innerHTML = '';
        const { context } = AppModel.appStore;
        const { activePlugin } = context;
        const pluginConfig = context.plugins
          ? context.plugins[activePlugin.config.title.toLowerCase()] : {};
        activePlugin.decorate(root, activePlugin.data, AppModel.appStore.searchQuery, pluginConfig);
      }
    });
  }

  /**
   * Loads the stylesheet for the active plugin
   * @returns {Promise<void>}
   */
  loadPluginStylesheet() {
    return new Promise((resolve) => {
      const styleSheet = document.createElement('link');
      styleSheet.setAttribute('rel', 'stylesheet');

      // Resolve when loaded or errored
      styleSheet.onload = () => resolve();

      /* c8 ignore next */
      styleSheet.onerror = () => resolve();

      // Assume the css file has the same name as the js file
      const href = AppModel.appStore.context.activePlugin.path.replace('.js', '.css');
      styleSheet.setAttribute('href', href);
      styleSheet.setAttribute('type', 'text/css');
      this.renderRoot.append(styleSheet);
    });
  }

  displayLoader() {
    this.progressContainer.value?.classList.add('visible');
  }

  hideLoader() {
    this.progressContainer.value?.classList.remove('visible');
  }

  sendToast(event) {
    EventBus.instance.dispatchEvent(new CustomEvent(PLUGIN_EVENTS.TOAST, { detail: event.detail }));
  }

  render() {
    return html`
      <div class="progress-container" ${ref(this.progressContainer)}>
        <sp-progress-circle indeterminate label="loading plugin"></sp-progress-circle>
      </div>
    `;
  }
}

customElements.define('plugin-renderer', PluginRenderer);
