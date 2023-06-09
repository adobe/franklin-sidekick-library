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

/* eslint-disable consistent-return, no-param-reassign */

import { LitElement, css } from 'lit';
import {
  fetchBlock,
  getBlockName,
  getDefaultLibraryMetadata,
  getLibraryMetadata,
} from '../../plugins/blocks/utils.js';
import { createSideNavItem, createTag } from '../../utils/dom.js';

export class BlockList extends LitElement {
  static properties = {
    mutationObserver: { state: false },
    type: { state: true },
  };

  static styles = css`
    .list-container {
      width: 100%;
    }

    .list-container sp-sidenav {
      width: 100%;
    }

    .list-container sp-sidenav sp-sidenav-item[aria-hidden] {
      display: none;
    }

    .message-container {
      padding-top: 50px;
    }
  `;

  constructor() {
    super();

    this.type = 'hierarchical';
  }

  /**
   * Called when the user clicks attempts to view the preview a block
   * @param {*} event The click event
   * @param {*} path The path to the block
   */
  onPreview(event, path) {
    this.dispatchEvent(new CustomEvent('PreviewBlock', { detail: { path } }));
    window.open(path, '_blank');
  }

  /**
   * Renders a not results view
   * @returns {String} HTML string
   */
  renderNoResults() {
    return /* html */`
      <div class="message-container">
          <sp-illustrated-message heading="No results">
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 150 103"
                  width="150"
                  height="103"
                  viewBox="0 0 150 103"
              >
                  <path
                      d="M133.7,8.5h-118c-1.9,0-3.5,1.6-3.5,3.5v27c0,0.8,0.7,1.5,1.5,1.5s1.5-0.7,1.5-1.5V23.5h119V92c0,0.3-0.2,0.5-0.5,0.5h-118c-0.3,0-0.5-0.2-0.5-0.5V69c0-0.8-0.7-1.5-1.5-1.5s-1.5,0.7-1.5,1.5v23c0,1.9,1.6,3.5,3.5,3.5h118c1.9,0,3.5-1.6,3.5-3.5V12C137.2,10.1,135.6,8.5,133.7,8.5z M15.2,21.5V12c0-0.3,0.2-0.5,0.5-0.5h118c0.3,0,0.5,0.2,0.5,0.5v9.5H15.2z M32.6,16.5c0,0.6-0.4,1-1,1h-10c-0.6,0-1-0.4-1-1s0.4-1,1-1h10C32.2,15.5,32.6,15.9,32.6,16.5z M13.6,56.1l-8.6,8.5C4.8,65,4.4,65.1,4,65.1c-0.4,0-0.8-0.1-1.1-0.4c-0.6-0.6-0.6-1.5,0-2.1l8.6-8.5l-8.6-8.5c-0.6-0.6-0.6-1.5,0-2.1c0.6-0.6,1.5-0.6,2.1,0l8.6,8.5l8.6-8.5c0.6-0.6,1.5-0.6,2.1,0c0.6,0.6,0.6,1.5,0,2.1L15.8,54l8.6,8.5c0.6,0.6,0.6,1.5,0,2.1c-0.3,0.3-0.7,0.4-1.1,0.4c-0.4,0-0.8-0.1-1.1-0.4L13.6,56.1z"
                  ></path>
              </svg>
          </sp-illustrated-message>
      </div>
    `;
  }

  filterBlocks(query) {
    const messageContainer = this.renderRoot.querySelector('.message-container');
    const blocks = this.renderRoot.querySelectorAll('sp-sidenav-item');
    const childItems = this.renderRoot.querySelectorAll('sp-sidenav-item > sp-sidenav-item');
    const parentItems = this.renderRoot.querySelectorAll('sp-sidenav > sp-sidenav-item');
    let allHidden = true;

    // Reset results
    if (query === '') {
      blocks.forEach((block) => {
        block.removeAttribute('aria-hidden');
        block.removeAttribute('expanded');
      });

      if (messageContainer) {
        messageContainer.remove();
      }

      return;
    }

    // Filter results
    childItems.forEach((block) => {
      const blockName = block.label.toLowerCase();
      const searchTags = block.dataset.searchTags ?? '';
      if (blockName.includes(query.toLowerCase()) || searchTags.split(',').some(tag => tag.toLowerCase().includes(query.toLowerCase()))) {
        block.removeAttribute('aria-hidden');
      } else {
        block.setAttribute('aria-hidden', true);
      }
    });

    // Check if all child items are hidden, if so, hide the parent
    parentItems.forEach((parentNavItem) => {
      let display = false;
      parentNavItem.querySelectorAll('sp-sidenav-item').forEach((childItem) => {
        if (!childItem.hasAttribute('aria-hidden')) {
          display = true;
          allHidden = false;

          if (messageContainer) {
            messageContainer.remove();
          }
        }
      });

      if (display) {
        parentNavItem.setAttribute('expanded', true);
        parentNavItem.removeAttribute('aria-hidden');
      } else {
        parentNavItem.setAttribute('aria-hidden', true);
      }
    });

    // Are there no results?
    if (allHidden && !messageContainer) {
      this.renderRoot.append(createTag('div', {}, this.renderNoResults()));
    }
  }

  /**
   * Loads the blocks into the container
   * @param {Object} data The block data
   * @param {*} containe The container to load the blocks into
   */
  async loadBlocks(data, container) {
    const listContainer = createTag('div', { class: 'list-container' });

    if (this.type === 'hierarchical') {
      const sideNav = createTag('sp-sidenav', { variant: 'multilevel', 'data-testid': 'blocks' });
      listContainer.append(sideNav);

      const blockParentItems = [];

      // Create an array of promises for each block
      const promises = data.map(async (blockData) => {
        const { url: blockURL } = blockData;
        const docPromise = fetchBlock(blockURL);

        try {
          const res = await docPromise;
          if (!res) {
            throw new Error(`An error occurred fetching ${blockData.name}`);
          }

          // Add block parent sidenav item
          const blockParentItem = createSideNavItem(
            blockData.name,
            'sp-icon-file-template',
            true,
            true,
            'sp-icon-preview',
          );
          blockParentItems.push(blockParentItem);

          blockParentItem.addEventListener('OnAction', e => this.onPreview(e, blockURL));

          // Get the body container of the block variants
          const { body } = res;

          // Check for default library metadata
          const defaultLibraryMetadata = getDefaultLibraryMetadata(body);

          // Query all variations of the block in the container
          const pageBlocks = [...body.querySelectorAll(':scope > div')];

          pageBlocks.forEach((blockWrapper, index) => {
            // Check if the variation has library metadata
            const sectionLibraryMetadata = getLibraryMetadata(blockWrapper) ?? {};
            const blockElement = blockWrapper.querySelector('div[class]');
            const blockName = getBlockName(blockElement, false);
            const authoredBlockName = sectionLibraryMetadata.name ?? getBlockName(blockElement);
            const blockNameWithVariant = getBlockName(blockElement, true);
            const searchTags = sectionLibraryMetadata.searchTags
                                ?? defaultLibraryMetadata.searchTags ?? '';
            if (!blockName) {
              return;
            }

            const blockVariantItem = createSideNavItem(
              authoredBlockName,
              'sp-icon-file-code',
              false,
              true,
              'sp-icon-copy',
            );

            // Add search tags to the sidenav item
            if (searchTags) {
              blockVariantItem.setAttribute('data-search-tags', searchTags);
            }

            blockVariantItem.classList.add('descendant');
            blockVariantItem.setAttribute('data-index', index);
            blockVariantItem.addEventListener('OnAction', (e) => {
              e.preventDefault();
              e.stopPropagation();
              this.dispatchEvent(new CustomEvent('CopyBlock', { detail: { blockWrapper, blockNameWithVariant, blockURL } }));
            });

            // Add child variant to parent
            blockParentItem.append(blockVariantItem);

            blockVariantItem.addEventListener('click', async () => {
              this.dispatchEvent(new CustomEvent('LoadBlock', {
                detail: {
                  blockWrapper, blockData, sectionLibraryMetadata, defaultLibraryMetadata,
                },
              }));
            });
          });

          return docPromise;
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error(e.message);
          container.dispatchEvent(new CustomEvent('Toast', { detail: { message: e.message, variant: 'negative' } }));
        }
      });

      // Wait for all promises to resolve
      await Promise.all(promises);

      // Sort results alphabetically
      sideNav.append(...blockParentItems.sort((a, b) => {
        const labelA = a.getAttribute('label').toLowerCase();
        const labelB = b.getAttribute('label').toLowerCase();
        if (labelA < labelB) {
          return -1;
        }
        if (labelA > labelB) {
          return 1;
        }
        return 0;
      }));

      if (sideNav.querySelectorAll('sp-sidenav-item').length === 0) {
        container.append(this.renderNoResults());
      }
    }

    this.renderRoot?.append(listContainer);
  }
}

customElements.define('block-list', BlockList);
