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
import '@spectrum-web-components/icons-workflow/icons/sp-icon-chevron-left.js';
import { EventBus } from '../../events/eventbus.js';
import AppModel from '../../models/app-model.js';
import { unloadPlugin } from '../../utils/plugin.js';
import {
  LOCALE_SET,
  PLUGIN_LOADED,
  PLUGIN_UNLOADED,
  SEARCH_UPDATED,
} from '../../events/events.js';

export class Header extends LitElement {
  static properties = {
    _searchActivated: { type: Boolean },
    _pluginActive: { type: Boolean },

    headerTitle: { type: String },
    searchEnabled: { type: Boolean },
  };

  static styles = css`
    .search {
      padding: 10px 5px;
      display: grid;
      grid-template-columns: 38px 1fr 38px;
      gap: 10px;
    }

    .search > div {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .search .title sp-search {
      display: none;
      width: 100%;
    }

    .search .title.search-active sp-search {
      display: block;
      width: 100%;
    }

    .search .title.search-active > span {
      display: none;
    }

    .logo-container {
      padding-left: 10px;
      height: 32px;
    }
  `;

  connectedCallback() {
    super.connectedCallback();

    EventBus.instance.addEventListener(PLUGIN_LOADED, () => {
      if (AppModel.appStore.activePlugin) {
        const { title, searchEnabled } = AppModel.appStore.activePlugin;
        this.headerTitle = title;

        if (searchEnabled) {
          this.searchEnabled = true;
        }

        this._pluginActive = true;
      }
    });

    EventBus.instance.addEventListener(PLUGIN_UNLOADED, () => {
      this.headerTitle = AppModel.appStore.localeDict.appTitle;
    });

    EventBus.instance.addEventListener(LOCALE_SET, () => {
      this.headerTitle = AppModel.appStore.localeDict.appTitle;
    });
  }

  onBack() {
    this._pluginActive = false;
    this.searchEnabled = false;
    this._searchActivated = false;
    unloadPlugin(AppModel);
    const title = this.renderRoot.querySelector('.title');
    title?.classList.remove('search-active');

    const searchInput = this.renderRoot.querySelector('sp-search');
    searchInput.value = '';
  }

  activateSearch() {
    const title = this.renderRoot.querySelector('.title');

    this._searchActivated = !this._searchActivated;
    if (this._searchActivated) {
      title?.classList.add('search-active');
    } else {
      title?.classList.remove('search-active');
    }

    const searchInput = this.renderRoot.querySelector('sp-search');
    searchInput?.focus();
  }

  onSearch(event) {
    AppModel.appStore.searchQuery = event.target.value;
    EventBus.instance.dispatchEvent(new CustomEvent(SEARCH_UPDATED));
  }

  render() {
    return html`<div class="search">
      <div>
        ${this._pluginActive ? html`
              <sp-action-button quiet @click=${this.onBack}>
                <sp-icon-chevron-left slot="icon"></sp-icon-chevron-left>
              </sp-action-button>
              ` : html`
              <div class="logo-container">
                <sp-icon
                  label="adobe logo"
                  size="xxl"
                  src="data:image/svg+xml;base64,PHN2ZyBpZD0iQWRvYmVFeHBlcmllbmNlQ2xvdWQiIGRhdGEtbmFtZT0iTGF5ZXIgMSIgdmlld0JveD0iLTUgLTUgMjUwIDI0NCIgd2lkdGg9IjI1MCIgaGVpZ2h0PSIyNDQiCiAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCBoZWlnaHQ9IjIzNCIgcng9IjQyLjUiIHdpZHRoPSIyNDAiIGZpbGw9IiNmYTBmMDAiLz4KICA8cGF0aCBkPSJNMTg2LjYxNyAxNzUuOTVoLTI4LjUwNmE2LjI0MyA2LjI0MyAwIDAgMS01Ljg0Ny0zLjc2OWwtMzAuOTQ3LTcyLjM1OWExLjM2NCAxLjM2NCAwIDAgMC0yLjYxMS0uMDM0TDk5LjQyIDE0NS43MzFhMS42MzUgMS42MzUgMCAwIDAgMS41MDYgMi4yNjloMjEuMmEzLjI3IDMuMjcgMCAwIDEgMy4wMSAxLjk5NGw5LjI4MSAyMC42NTVhMy44MTIgMy44MTIgMCAwIDEtMy41MDcgNS4zMDFINTMuNzM0YTMuNTE4IDMuNTE4IDAgMCAxLTMuMjEzLTQuOTA0bDQ5LjA5LTExNi45MDJBNi42MzkgNi42MzkgMCAwIDEgMTA1Ljg0MyA1MGgyOC4zMTRhNi42MjggNi42MjggMCAwIDEgNi4yMzIgNC4xNDRsNDkuNDMgMTE2LjkwMmEzLjUxNyAzLjUxNyAwIDAgMS0zLjIwMiA0LjkwNHoiIGRhdGEtbmFtZT0iMjU2IiBmaWxsPSIjZmZmIi8+Cjwvc3ZnPg=="
                ></sp-icon>
              </div>
            `}
      </div>
      <div class="title">
        <span>${this.headerTitle}</span>
        <sp-search
          @input=${this.onSearch}
          @submit=${e => e.preventDefault()}
        ></sp-search>
      </div>
      <div>
        ${this._pluginActive && this.searchEnabled ? html`
          <sp-action-button id="searchButton" quiet toggles @click=${this.activateSearch}>
            <sp-icon-search slot="icon"></sp-icon-search>
          </sp-action-button>` : ''}
      </div>
    </div>`;
  }
}

customElements.define('library-header', Header);
