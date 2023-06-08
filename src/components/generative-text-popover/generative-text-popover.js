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
import { fetchCompletion } from '../../utils/openai.js';
import { EventBus } from '../../events/eventbus.js';
import AppModel from '../../models/app-model.js';

export class GenerativeTextPopover extends LitElement {
  promptInput = createRef();

  popover = createRef();

  generateButton = createRef();

  static properties = {
    generating: { state: true },
  };

  static styles = css`
    :host([dialog]) {
      padding: 10px;
    }

    sp-action-button {
      padding-top: 2px;
    }
  `;

  constructor() {
    super();
    this.state = 'ready';
  }

  connectedCallback() {
    super.connectedCallback();
  }

  onOpen() {
    // Focus the input after the popover is open
    this.promptInput.value.focus();
  }

  async onGenerate() {
    this.generateButton.value.toggleAttribute('disabled');
    this.promptInput.value.toggleAttribute('disabled');

    this.generating = true;
    this.popover.value.open = false;
    try {
      const res = await fetchCompletion(`${this.promptInput.value.value}`);
      this.dispatchEvent(new CustomEvent('generated', { detail: { generated: res } }));
    } catch (error) {
      this.dispatchEvent(new CustomEvent('error', { detail: { message: error } }));

      this.remove();
      EventBus.instance.dispatchEvent(new CustomEvent('Toast', { detail: { message: error, variant: 'negative' } }));
    }
  }

  render() {
    return html`
      <overlay-trigger placement="top-start" @sp-opened=${this.onOpen}>
        <sp-action-button slot="trigger">
         ${this.generating
    ? html`
              <sp-progress-circle
                indeterminate
                size="s">
              </sp-progress-circle>
          `
    : html`
              <sp-icon-magic-wand></sp-icon-magic-wand>
          `}
        </sp-action-button>
        <sp-popover
          placement="bottom-end"
          tip
          open
          slot="click-content"
          style="width:500px;"
          ${ref(this.popover)}>

          <style>       
            .container {
              padding: 10px;
            }

            .container .prompt-container {
              display: flex; 
              gap: 10px;
            }

            .container .generating-container {
              display: flex;
              justify-content: center;
            }

            sp-textfield {
              flex-grow: 1;
            }
          </style>
          <div class="container">
            <div class="prompt-container">
              <sp-textfield 
                placeholder=${AppModel.appStore.localeDict.generativeTextPrompt} 
                ${ref(this.promptInput)}>
              </sp-textfield>
              <sp-action-button 
                @click=${this.onGenerate} 
                ${ref(this.generateButton)}>
                  <sp-icon-magic-wand slot="icon"></sp-icon-magic-wand>
                  ${AppModel.appStore.localeDict.generativeTextCTA}
              </sp-action-button>
            </div>
          </div>
        </sp-popover>
    </overlay-trigger>`;
  }
}

customElements.define('generative-text-popover', GenerativeTextPopover);
