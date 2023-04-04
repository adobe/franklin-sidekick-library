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
import '@spectrum-web-components/theme/sp-theme.js';
import '@spectrum-web-components/theme/src/themes.js';
import '@spectrum-web-components/sidenav/sp-sidenav.js';
import '@spectrum-web-components/icons/sp-icons-medium.js';
import '@spectrum-web-components/action-button/sp-action-button.js';
import '@spectrum-web-components/search/sp-search.js';
import '@spectrum-web-components/divider/sp-divider.js';
import '@spectrum-web-components/toast/sp-toast.js';
import '@spectrum-web-components/tooltip/sp-tooltip.js';
import '@spectrum-web-components/overlay/overlay-trigger.js';
import '@spectrum-web-components/progress-circle/sp-progress-circle.js';
import '@spectrum-web-components/illustrated-message/sp-illustrated-message.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-search.js';
import '@spectrum-web-components/button/sp-button.js';
import '@spectrum-web-components/icon/sp-icon.js';
import '@spectrum-web-components/menu/sp-menu.js';
import './components/menu-item/menu-item.js';
import './components/sidenav/sidenav-item.js';
import './components/header/header.js';
import './components/illustrated-message/illustrated-message.js';
import './views/library-list/library-list.js';
import './views/plugin-renderer/plugin-renderer.js';
import AppModel from './models/app-model.js';
import { EventBus } from './events/eventbus.js';
import { createTag } from './utils/dom.js';
import {
  LOCALE_SET, PLUGIN_LOADED, PLUGIN_UNLOADED, TOAST,
} from './events/events.js';
import { loadLibary } from './utils/library.js';

export class FranklinLibrary extends LitElement {
  static styles = css`
    * {
      box-sizing: border-box;
    }

    main {
      background-color: var(--spectrum-global-color-gray-100);
      color: var(--spectrum-global-color-gray-800);
      height: 100%;
      max-width: 360px;
      height: 364px;
      overflow: hidden;
      position: relative;
      display: flex;
      flex-direction: column;
    }

    main .container {
      position: relative;
      height: calc(100% - 52px);
      overflow-y: auto;
      overflow-x: hidden;
    }

    .search {
      padding: 10px 10px;
    }

    .search sp-search {
      width: 100%;
    }

    library-list {
      width: 100%;
      padding: 5px;
      padding-top: 0;
      transition: transform 0.2s ease-in-out;
      position: absolute;
    }

    library-list.inset {
      transform: translateX(-360px);
    }

    plugin-renderer {
      transform: translateX(360px);
      list-style: none;
      padding: 0;
      margin: 0;
      position: absolute;
      inset: 0;
      transition: transform 0.2s ease-in-out;
      visibility: hidden;
    }

    plugin-renderer.inset {
      transform: translateX(0);
      visibility: visible;
    }

    .toast-container {
      width: 100%;
      display: flex;
      justify-content: center;
    }

    sp-toast {
      position: absolute;
      bottom: 10px;
      margin: 0 auto;
    }
  `;

  async loadLocaleDict(lang) {
    const dict = {};
    const dictPath = `${AppModel.appStore.webRoot}locales/${lang}/messages.json`;
    try {
      const res = await fetch(dictPath);
      const messages = await res.json();
      Object.keys(messages).forEach((key) => {
        dict[key] = messages[key].message;
      });
    } catch (e) {
      console.error(`failed to fetch dictionary from ${dictPath}`); // eslint-disable-line no-console
    }

    AppModel.appStore.localeDict = dict;
    EventBus.instance.dispatchEvent(new CustomEvent(LOCALE_SET));
  }

  isValidConfig(config) {
    return !!((config && config.library));
  }

  async connectedCallback() {
    super.connectedCallback();
    AppModel.init();

    EventBus.instance.addEventListener(LOCALE_SET, () => {
      this.requestUpdate();
      if (!this.configured) {
        const message = createTag('illustrated-message', {
          heading: AppModel.appStore.localeDict.invalidConfiguration,
          description: AppModel.appStore.localeDict.invalidConfigurationDescription,
        });
        this.renderRoot.querySelector('.container')?.append(message);
      }
    });

    this.loadLocaleDict('en');

    this.configured = this.isValidConfig(this.config);

    if (!this.configured) return;

    await loadLibary(
      AppModel,
      this.config,
    );

    const home = this.renderRoot.querySelector('library-list');
    const library = this.renderRoot.querySelector('plugin-renderer');

    EventBus.instance.addEventListener(PLUGIN_LOADED, () => {
      home?.classList.add('inset');
      library?.classList.add('inset');
    });

    EventBus.instance.addEventListener(PLUGIN_UNLOADED, () => {
      home?.classList.remove('inset');
      library?.classList.remove('inset');
    });

    EventBus.instance.addEventListener(TOAST, (e) => {
      const toastContainer = this.renderRoot.querySelector('.toast-container');
      const toast = createTag('sp-toast', { open: true, variant: e.detail.variant ?? 'positive', timeout: 200 });
      toast.textContent = e.detail.message ?? 'Done';
      toastContainer.append(toast);
    });
  }

  render() {
    return html`
      <sp-theme theme="spectrum" color="dark" scale="">
        <sp-icons-medium></sp-icons-medium>
        <main>
          <library-header></library-header>
          <sp-divider size="s"></sp-divider>
          <div class="container">
            ${this.configured ? html`
              <library-list></library-list>
              <plugin-renderer></plugin-renderer>            
            ` : ''}
          </div>
          <div class="toast-container"></div>
        </main>
      </sp-theme>
    `;
  }
}

customElements.define('franklin-library', FranklinLibrary);
