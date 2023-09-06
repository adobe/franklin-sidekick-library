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
import { html, css } from 'lit';
import { SideNavItem as SPSideNavItem } from '@spectrum-web-components/sidenav';
import { ifDefined } from '@spectrum-web-components/base/src/directives.js';
import { APP_EVENTS } from '../../events/events.js';

export class SideNavItem extends SPSideNavItem {
  static properties = {
    icon: '',
    disclosureArrow: false,
    action: false,
  };

  static get styles() {
    return [
      ...super.styles,
      css`
        #item-link {
          display: flex;
          justify-content: space-between;
          min-height: 42px;
        }

        .actions {
          display: none;
        }

        #item-link:hover .actions{
          display: block;
        }

        #item-link .spacer{
          width: 16px;
        }

        :host {
          padding-right: 5px;
        }

        :host([expanded]) .disclosureArrow {
          transform: rotate(90deg);
        }

        :host(.descendant) {
          padding-left: 23px;
        }

        .container {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      `,
    ];
  }

  connectedCallback() {
    super.connectedCallback();
  }

  onClick() {
    this.handleClick();
    this.selected = false;
  }

  onAction(e) {
    e.preventDefault();
    e.stopPropagation();
    this.dispatchEvent(new CustomEvent(APP_EVENTS.ON_ACTION));
  }

  render() {
    return html`
      <a
        target=${ifDefined(this.target)}
        download=${ifDefined(this.download)}
        rel=${ifDefined(this.rel)}
        data-level="${this.depth}"
        @click="${this.onClick}"
        id="item-link"
        aria-current=${ifDefined(this.selected && this.href ? 'page' : undefined)}
      >
        ${this.disclosureArrow ? html`<sp-icon-chevron-right class="disclosureArrow" size="s"></sp-icon-chevron-right>` : html`<span class="spacer"></span>`}
        <slot name="icon"></slot>
        <div class="container">
          ${this.label}
          ${this.action ? html`
            <div class='actions'>
              ${this.action ? html`
                <sp-action-button quiet @click=${this.onAction}>
                  <slot name="action-icon" slot="icon"></slot>
                </sp-action-button>
              ` : ''}
            </div>
          ` : ''}
        </div>
      </a>
      ${this.expanded ? html` <slot name="descendant"></slot> ` : html``}
    `;
  }
}

customElements.define('sp-sidenav-item', SideNavItem);
