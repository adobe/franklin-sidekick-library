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
import AppModel from './models/app-model.js';
import { EventBus } from './events/eventbus.js';
import { createTag } from './utils/dom.js';
import { APP_EVENTS } from './events/events.js';
import { loadLibrary } from './utils/library.js';
import { sampleRUM } from './utils/rum.js';

class SidekickLibrary extends LitElement {
  static properties = {
    theme: undefined,
  };

  static styles = css`
    * {
      box-sizing: border-box;
    }

    sp-theme {
      height: 100%;
    }

    main {
      background-color: var(--spectrum-global-color-gray-100);
      color: var(--spectrum-global-color-gray-800);
      height: 100%;
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

    plugin-renderer {
      width: 100%;
      list-style: none;
      transition: transform 0.2s ease-in-out;
    }

    .toast-container {
      display: flex;
      justify-content: center;
      z-index: 100;
    }


    .toast-container sp-toast {
      max-width: 600px;
      min-width: 200px;
      margin: 0 auto;
    }

    sp-toast {
      position: absolute;
      width: 90%;
      bottom: 10px;
    }

    sp-split-view {
      height: 100%;
    }
  `;

  async loadLocaleDict(lang) {
    const dict = {};
    const dictPath = `${AppModel.appStore.webRoot}/locales/${lang}/messages.json`;
    try {
      const res = await fetch(dictPath);
      const messages = await res.json();
      Object.keys(messages).forEach((key) => {
        dict[key] = messages[key].message;
      });
    /* c8 ignore next 3 */
    } catch (e) {
      console.error(`failed to fetch dictionary from ${dictPath}`); // eslint-disable-line no-console
    }

    AppModel.appStore.localeDict = dict;
    EventBus.instance.dispatchEvent(new CustomEvent(APP_EVENTS.LOCALE_SET));
  }

  isValidConfig(config) {
    // Was the config set via a property?
    if (config?.base) {
      return true;
    }

    const { searchParams } = new URL(window.location.href);
    const params = {};

    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }

    // Config is only valid if it contains a library
    if (params.base) {
      this.config = params;
      return true;
    }

    // eslint-disable-next-line no-console
    console.error('Missing base configuration');
    return false;
  }

  async connectedCallback() {
    super.connectedCallback();
    this.getTheme();
    AppModel.init();

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addListener((e) => {
      /* c8 ignore next */
      this.theme = e.matches ? 'dark' : 'light';
    });

    EventBus.instance.addEventListener(APP_EVENTS.TOAST, (e) => {
      const toastContainer = this.renderRoot.querySelector('.toast-container');
      const toast = createTag('sp-toast', { open: true, variant: e.detail.variant ?? 'positive', timeout: 200 });
      toast.textContent = e.detail.message ?? 'Done';
      toastContainer.append(toast);

      toast.addEventListener('close', () => {
        toastContainer?.removeChild(toast);
      });

      if (AppModel.appStore.context.libraries && AppModel.appStore.context.libraries.length === 0) {
        this.renderIllustratedMessage();
      }
    });

    EventBus.instance.addEventListener(APP_EVENTS.LOCALE_SET, () => {
      this.requestUpdate();
      if (!this.configured) {
        this.renderIllustratedMessage();
      }
    });

    this.configured = this.isValidConfig(this.config);

    this.loadLocaleDict('en');

    if (!this.configured) return;

    // Set the context
    AppModel.appStore.context = this.config;

    await loadLibrary();

    // Track library opened
    sampleRUM('library:opened');
  }

  renderIllustratedMessage() {
    const {
      invalidConfiguration,
      invalidConfigurationDescription,
    } = AppModel.appStore.localeDict;

    const message = createTag('illustrated-message', {
      heading: invalidConfiguration,
      description: invalidConfigurationDescription,
    });
    this.renderRoot.querySelector('.container')?.append(message);
  }

  getTheme() {
    this.theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  render() {
    return html`
      <sp-theme theme="spectrum" color=${this.theme} scale="medium">
        <main>
          <library-header></library-header>
          <sp-divider size="s"></sp-divider>
          <div class="container">
            ${this.configured ? html`
              <plugin-renderer></plugin-renderer>     
            ` : ''}
          </div>
          <div class="toast-container"></div>
        </main>
      </sp-theme>
    `;
  }
}

customElements.define('sidekick-library', SidekickLibrary);
