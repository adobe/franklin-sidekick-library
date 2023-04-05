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
import '@spectrum-web-components/icons-workflow/icons/sp-icon-copy.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-preview.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-info.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-view-detail.js';
import '@spectrum-web-components/icon/sp-icon.js';
import { PREVIEW_CONTENT } from '../../events/events.js';

export class SideNavItem extends SPSideNavItem {
  static properties = {
    disclosureArrow: false,
    copy: false,
    preview: false,
    info: '',
    demo: '',
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
          display: flex;
        }
      `,
    ];
  }

  get hasActions() {
    return this.copy || this.preview || this.info || this.demo;
  }

  connectedCallback() {
    super.connectedCallback();
    this.info = this.getAttribute('data-info');
    this.demo = this.getAttribute('data-demo');
  }

  onClick() {
    this.handleClick();
    this.selected = false;
  }

  onPreview(e) {
    e.stopPropagation();
    this.dispatchEvent(new CustomEvent(PREVIEW_CONTENT));
  }

  onDemo(e) {
    e.stopPropagation();
    const trigger = this.renderRoot.querySelector('#demoTrigger');
    trigger?.setAttribute('open', 'click');
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
        <slot name="icon"></slot>
        ${this.label}
        <slot></slot>
        ${this.disclosureArrow ? html`<sp-icon size="s" name="ui:Chevron100"></sp-icon>` : ''}
        ${this.hasActions ? html`
          <div class='actions'>
            ${this.info ? html`
              <overlay-trigger placement="left">
                <sp-tooltip slot="hover-content" variant="info">${this.info}</sp-tooltip>
                <sp-action-button quiet tip slot="trigger">
                  <sp-icon-info slot="icon"></sp-icon-info>
                </sp-action-button>
              </overlay-trigger>
            ` : ''}
            ${this.demo ? html`
              <overlay-trigger id="demoTrigger" placement="right" @click=${this.onDemo}>
                <sp-action-button quiet tip slot="trigger">
                  <sp-icon-view-detail slot="icon"></sp-icon-view-detail>
                </sp-action-button>
                <div
                    slot="click-content"
                    style="resize: both;"
                >
                    <iframe title="demo" width="400" height="600" frameBorder="0" style="resize: both;overflow:auto;" src=${this.demo}></iframe>
                </div>
              </overlay-trigger>
            ` : ''}
            ${this.preview ? html`
              <sp-action-button quiet @click=${this.onPreview}>
                <sp-icon-preview slot="icon"></sp-icon-preview>
              </sp-action-button>
            ` : ''}
          </div>
        ` : ''}
      </a>
      ${this.expanded ? html` <slot name="descendant"></slot> ` : html``}
    `;
  }
}

customElements.define('sp-sidenav-item', SideNavItem);
