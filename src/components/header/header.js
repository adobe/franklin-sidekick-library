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
import { capitalize, removeAllURLParams, setURLParams } from '../../utils/dom.js';
import AppModel from '../../models/app-model.js';
import { EventBus } from '../../events/eventbus.js';
import { APP_EVENTS } from '../../events/events.js';
import { loadPlugin, unloadPlugin } from '../../utils/plugin.js';

export class Header extends LitElement {
  static properties = {
    searchActivated: { type: Boolean },
    pluginActive: { type: Boolean },
    libraries: { type: Array },
    searchEnabled: { type: Boolean },
    defaultPluginName: { type: String },
  };

  static styles = css`
    .search {
      padding: 10px 5px;
      display: grid;
      grid-template-columns: 238px 1fr 238px;
      gap: 10px;
    }

    @media (max-width: 768px) {
      .search {
        grid-template-columns: 40px 1fr 40px;
      }

      .logo-container span {
        display: none;
      }
    }

    .search > div {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .search .middle-bar sp-search {
      display: none;
      width: 100%;
    }

    .search .middle-bar sp-picker {
      padding-top: 7px;
    }

    .search .middle-bar.search-active sp-search {
      display: block;
      width: 100%;
      max-width: 400px;
      min-width: 200px;
    }

    .search .middle-bar.search-active > span {
      display: none;
    }

    .search .middle-bar.search-active > sp-picker  {
      display: none;
    }

    .logo-container {
      width: 100%;
      padding-left: 10px;
      height: 32px;
      display: flex;
      justify-content: left;
      align-items: center;
      gap: 10px;
    }

    .search .tools {
      display: flex;
      justify-content: flex-end;
    }
  `;

  connectedCallback() {
    super.connectedCallback();

    // Listen for the library to be loaded, set the default plugin (blocks) and load it
    EventBus.instance.addEventListener(APP_EVENTS.LIBRARY_LOADED, () => {
      const { context } = AppModel.appStore;
      const { libraries } = context;
      const keys = Object.keys(libraries);

      // Store libraries in state
      this.libraries = libraries;

      let activePlugin = keys.includes('blocks') ? 'blocks' : keys[0];

      // Check if the url deep links to a plugin
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.has('plugin')) {
        const plugin = searchParams.get('plugin');
        activePlugin = plugin;
      }

      loadPlugin(AppModel, activePlugin);
    });

    // Listen for a plugin to be loaded
    EventBus.instance.addEventListener(APP_EVENTS.PLUGIN_LOADED, () => {
      const { context } = AppModel.appStore;
      if (context.activePlugin) {
        const { activePlugin } = context;
        const { searchEnabled } = activePlugin.config;

        if (searchEnabled) {
          this.searchEnabled = true;
        }

        this.pluginActive = true;
        this.defaultPluginName = activePlugin.config.title.toLowerCase().replace(' ', '-');

        setURLParams([['plugin', this.defaultPluginName]]);
      }
    });

    EventBus.instance.addEventListener(APP_EVENTS.PLUGIN_UNLOADED, () => {
      this.pluginActive = false;
      this.searchEnabled = false;
      this.searchActivated = false;

      const middleBar = this.renderRoot.querySelector('.middle-bar');
      middleBar?.classList.remove('search-active');

      const searchInput = this.renderRoot.querySelector('sp-search');
      searchInput.value = '';
    });
  }

  activateSearch() {
    const middleBar = this.renderRoot.querySelector('.middle-bar');

    this.searchActivated = !this.searchActivated;
    if (this.searchActivated) {
      middleBar?.classList.add('search-active');
    } else {
      middleBar?.classList.remove('search-active');
    }

    const searchInput = this.renderRoot.querySelector('sp-search');
    searchInput?.focus();
  }

  async onPluginChange(e) {
    const { value } = e.target;
    removeAllURLParams();

    unloadPlugin(AppModel);
    await loadPlugin(AppModel, value);
  }

  onSearch(event) {
    AppModel.appStore.searchQuery = event.target.value;
    EventBus.instance.dispatchEvent(new CustomEvent(APP_EVENTS.SEARCH_UPDATED));
  }

  renderLibraries() {
    if (this.libraries) {
      const keys = Object.keys(this.libraries);
      return html`
        <sp-picker
          quiet 
          value=${this.defaultPluginName}
          size="m" 
          label="Select Library"
          @change=${this.onPluginChange}>
          ${keys.map(key => html`
            <sp-menu-item
              value=${key}
              disclosureArrow="true" 
              data-testid="library-item">${capitalize(key)}</sp-menu-item>`)}
        </sp-picker>`;
    }

    return '';
  }

  render() {
    return html`
      <div class="search">
        <div>
          <div class="logo-container">
            <sp-icon
              label="adobe logo"
              size="xxl"
              src="data:image/svg+xml;base64,PHN2ZyBpZD0iQWRvYmVFeHBlcmllbmNlQ2xvdWQiIGRhdGEtbmFtZT0iTGF5ZXIgMSIgdmlld0JveD0iLTUgLTUgMjUwIDI0NCIgd2lkdGg9IjI1MCIgaGVpZ2h0PSIyNDQiCiAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCBoZWlnaHQ9IjIzNCIgcng9IjQyLjUiIHdpZHRoPSIyNDAiIGZpbGw9IiNmYTBmMDAiLz4KICA8cGF0aCBkPSJNMTg2LjYxNyAxNzUuOTVoLTI4LjUwNmE2LjI0MyA2LjI0MyAwIDAgMS01Ljg0Ny0zLjc2OWwtMzAuOTQ3LTcyLjM1OWExLjM2NCAxLjM2NCAwIDAgMC0yLjYxMS0uMDM0TDk5LjQyIDE0NS43MzFhMS42MzUgMS42MzUgMCAwIDAgMS41MDYgMi4yNjloMjEuMmEzLjI3IDMuMjcgMCAwIDEgMy4wMSAxLjk5NGw5LjI4MSAyMC42NTVhMy44MTIgMy44MTIgMCAwIDEtMy41MDcgNS4zMDFINTMuNzM0YTMuNTE4IDMuNTE4IDAgMCAxLTMuMjEzLTQuOTA0bDQ5LjA5LTExNi45MDJBNi42MzkgNi42MzkgMCAwIDEgMTA1Ljg0MyA1MGgyOC4zMTRhNi42MjggNi42MjggMCAwIDEgNi4yMzIgNC4xNDRsNDkuNDMgMTE2LjkwMmEzLjUxNyAzLjUxNyAwIDAgMS0zLjIwMiA0LjkwNHoiIGRhdGEtbmFtZT0iMjU2IiBmaWxsPSIjZmZmIi8+Cjwvc3ZnPg==">
            </sp-icon>
            <span>${AppModel.appStore.localeDict.appTitle}</span>
          </div>
        </div>
        <div class="middle-bar">
          ${this.renderLibraries()}
          <sp-search
            placeholder=${AppModel.appStore.localeDict.search}
            @input=${this.onSearch}
            @submit=${e => e.preventDefault()}>
          </sp-search>
        </div>
        <div class="tools">
          ${this.pluginActive && this.searchEnabled
    ? html`
            <sp-action-button 
              id="search-button" 
              quiet 
              toggles 
              @click=${this.activateSearch}>
                <sp-icon-search slot="icon"></sp-icon-search>
            </sp-action-button>`
    : ''}
        </div>
      </div>`;
  }
}

customElements.define('library-header', Header);
