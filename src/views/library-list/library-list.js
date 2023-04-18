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
import AppModel from '../../models/app-model.js';
import { EventBus } from '../../events/eventbus.js';
import { isDev } from '../../utils/library.js';
import { capitalize } from '../../utils/dom.js';
import { APP_EVENTS, PLUGIN_EVENTS } from '../../events/events.js';
import { loadPlugin, unloadPlugin } from '../../utils/plugin.js';

const plugins = {
  blocks: isDev() ? '../../src/plugins/blocks/blocks.js' : `${AppModel.host}/plugins/blocks/blocks.js`,
};

export class LibraryList extends LitElement {
  static properties = {
    libraries: undefined,
  };

  static styles = css`
    sp-sidenav {
      width: 100%;
    }
  `;

  connectedCallback() {
    super.connectedCallback();

    EventBus.instance.addEventListener(APP_EVENTS.LIBRARY_LOADED, () => {
      this.libraries = AppModel.appStore.libraries;
    });
  }

  async onSelect(e) {
    const { value } = e.target;
    const { config } = AppModel.appStore;

    const pluginPath = config[value] ?? plugins[value];
    if (pluginPath) {
      try {
        await loadPlugin(AppModel, value, pluginPath);
      } catch (error) {
        EventBus.instance.dispatchEvent(new CustomEvent(PLUGIN_EVENTS.TOAST, {
          detail: {
            variant: 'negative',
            message: AppModel.appStore.localeDict.errorLoadingPlugin,
          },
        }));

        unloadPlugin(AppModel);

        // eslint-disable-next-line no-console
        console.error(`Error loading plugin ${value}: ${error.message}`);
      }
      return;
    }

    EventBus.instance.dispatchEvent(new CustomEvent(PLUGIN_EVENTS.TOAST, {
      detail: {
        variant: 'negative',
        message: AppModel.appStore.localeDict.unknownPlugin,
      },
    }));
  }

  renderLibraries() {
    if (this.libraries) {
      return Object.keys(this.libraries).map(
        key => html`<sp-sidenav-item value=${key} disclosureArrow="true" data-testid="library-item">${capitalize(key)}</sidenav-item>`,
      );
    }

    return '';
  }

  render() {
    return html`<div class="home">
      <sp-sidenav @click=${this.onSelect} data-testid=${this.libraries ? 'libraries-loaded' : ''}>
       ${this.renderLibraries()}
      </sp-sidenav>
    </div>`;
  }
}

customElements.define('library-list', LibraryList);
