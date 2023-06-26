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
import { html } from 'lit';
import { Card as SPCard } from '@spectrum-web-components/card';

export class Card extends SPCard {
  render() {
    return html`
            <div class="body">
                <div class="header">
                    ${this.renderHeading}
                    ${this.variant === 'gallery'
    ? this.renderSubtitleAndDescription
    : html``}
                    ${this.variant !== 'quiet' || this.size !== 's'
    ? html`
                              <div
                                  class="action-button"
                                  @pointerdown=${this.stopPropagationOnHref}
                              >
                                  <slot name="actions"></slot>
                              </div>
                          `
    : html``}
                </div>
                ${this.variant !== 'gallery'
    ? html`
                          <div class="content">
                              ${this.renderSubtitleAndDescription}
                          </div>
                      `
    : html``}
            </div>
            ${this.href
    ? this.renderAnchor({
      id: 'like-anchor',
      labelledby: 'heading',
    })
    : html``}
            ${this.variant === 'standard'
    ? html`
                      <slot name="footer"></slot>
                  `
    : html``}
            ${this.renderImage()}
            ${this.toggles
    ? html`
                      <sp-quick-actions
                          class="quick-actions"
                          @pointerdown=${this.stopPropagationOnHref}
                      >
                          <sp-checkbox
                              class="checkbox"
                              @change=${this.handleSelectedChange}
                              ?checked=${this.selected}
                              tabindex="-1"
                          ></sp-checkbox>
                      </sp-quick-actions>
                  `
    : html``}
        `;
  }
}

customElements.define('sp-card', Card);
