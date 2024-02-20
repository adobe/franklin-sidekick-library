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
  getPageMetadata,
} from '../../plugins/blocks/utils.js';
import { createSideNavItem, createTag } from '../../utils/dom.js';

export class BlockList extends LitElement {
  static properties = {
    mutationObserver: { state: false },
    selectedItem: { state: false },
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


    .list-container sp-sidenav sp-sidenav-item[label="Unnamed Item"] {
      --spectrum-sidenav-item-text-color: var(--spectrum-negative-color-700);
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
      const blockName = block.getAttribute('label').toLowerCase();
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
    // Check if there is a deeplink to a block (path and index)
    const sp = new URLSearchParams(window.location.search);
    const dlPath = sp.has('path') ? sp.get('path') : undefined;
    const dlIndex = sp.has('index') ? sp.get('index') : undefined;

    const listContainer = createTag('div', { class: 'list-container' });

    if (this.type === 'hierarchical') {
      const sideNav = createTag('sp-sidenav', { variant: 'multilevel', 'data-testid': 'blocks' });
      listContainer.append(sideNav);

      const blockParentItems = [];

      // Parent item for templates
      let templatesParentItem;

      // Create an array of promises for each block
      const promises = data.map(async (blockData) => {
        const { url: blockURL, path } = blockData;
        const blockPromise = fetchBlock(blockURL);

        try {
          const blockDocument = await blockPromise;
          if (!blockDocument) {
            throw new Error(`An error occurred fetching ${blockData.name}`);
          }

          // Get the body container of the block variants, clone it so we don't mutate the original
          const { body } = blockDocument.cloneNode(true);

          // Check for default library metadata
          const defaultLibraryMetadata = getDefaultLibraryMetadata(body) ?? {};

          // Get the block type
          const blockType = defaultLibraryMetadata.type ?? undefined;

          // Check for page metadata
          const pageMetadata = getPageMetadata(body);

          // Is this a template?
          if (blockType && blockType.toLowerCase() === 'template') {
            // If templates parent sidenav item doesn't exist, create it
            if (!templatesParentItem) {
              templatesParentItem = createSideNavItem(
                'Templates',
                'sp-icon-file-code',
                true,
                false,
              );

              blockParentItems.push(templatesParentItem);
            }

            // For templates we pull the template name from default library metadata
            // or the name given to the document in the library sheet.
            const itemName = defaultLibraryMetadata.name ?? blockData.name;
            const searchTags = defaultLibraryMetadata.searchtags ?? defaultLibraryMetadata['search-tags'] ?? '';

            const pageItem = createSideNavItem(
              itemName,
              'sp-icon-file-code',
              false,
              true,
              'sp-icon-copy',
            );

            // Add search tags to the sidenav item
            if (searchTags) {
              pageItem.setAttribute('data-search-tags', searchTags);
            }

            // Construct an event payload
            const eventPayload = {
              detail: {
                blockWrapper: body,
                blockData,
                blockURL,
                defaultLibraryMetadata,
                pageMetadata,
              },
            };

            // Handle sidenav item actions (copy)
            pageItem.addEventListener('OnAction', (e) => {
              e.preventDefault();
              e.stopPropagation();
              this.dispatchEvent(new CustomEvent('CopyBlock', eventPayload));
            });

            // Add the template to the templates sidenav item
            templatesParentItem.append(pageItem);

            // On item click.. Load the template
            pageItem.addEventListener('click', async () => {
              this.dispatchEvent(new CustomEvent('LoadTemplate', eventPayload));
            });

            // If the template path matches the URL params, load the block
            if (dlPath === path) {
              templatesParentItem.setAttribute('expanded', true);
              this.selectedItem = pageItem;
              this.dispatchEvent(new CustomEvent('LoadTemplate', eventPayload));
            }
          } else {
            // This is just a block.. single, compound or multi-section
            // Add block parent sidenav item
            const blockParentItem = createSideNavItem(
              blockData.name,
              'sp-icon-file-template',
              true,
              true,
              'sp-icon-preview',
            );

            // Add to the block parent items array
            blockParentItems.push(blockParentItem);

            // Listen for preview events
            blockParentItem.addEventListener('OnAction', e => this.onPreview(e, blockURL));

            // Query all variations of the block in the container
            const pageBlocks = body.querySelectorAll(':scope > div');

            let skipNext = 0;

            pageBlocks.forEach((blockWrapper, index) => {
              // If the previous block had an includeNextSections attribute (multi-section block)
              // we need may need to skip the next n number of siblings since
              // they are part of the multi-section block
              if (skipNext > 0) {
                skipNext -= 1;
                return;
              }

              // Check if the variation has library metadata
              const sectionLibraryMetadata = getLibraryMetadata(blockWrapper) ?? {};
              const blockElement = blockWrapper.querySelector('div[class]');
              let itemName = sectionLibraryMetadata.name ?? getBlockName(blockElement);
              const blockNameWithVariant = getBlockName(blockElement, true);
              const searchTags = sectionLibraryMetadata.searchtags
                                ?? sectionLibraryMetadata['search-tags']
                                ?? defaultLibraryMetadata.searchtags
                                ?? defaultLibraryMetadata['search-tags']
                                ?? '';

              // If the item doesn't have an authored or default
              // name (default content), set to 'Unnamed Item'
              if (!itemName || itemName === 'section-metadata') {
                itemName = 'Unnamed Item';
              }

              // Check if the copy button should be disabled
              const disableCopy = sectionLibraryMetadata.disablecopy
              ?? defaultLibraryMetadata.disablecopy
              ?? false;

              // Create the sidenav item for the variant
              const blockVariantItem = createSideNavItem(
                itemName,
                'sp-icon-file-code',
                false,
                true,
                'sp-icon-copy',
                disableCopy,
              );

              // Add search tags to the sidenav item
              if (searchTags) {
                blockVariantItem.setAttribute('data-search-tags', searchTags);
              }

              // Assume this is not a compound block
              sectionLibraryMetadata.compoundBlock = false;

              // Get the number of blocks in the section
              const blocksInSection = blockWrapper.querySelectorAll('div[class]:not(.section-metadata)').length ?? 0;

              // Check if the section has an includeNextSections attribute
              // If it does is this a multi-section block
              if (sectionLibraryMetadata.includeNextSections) {
                const includeNextSections = Number(sectionLibraryMetadata.includeNextSections);

                // Make sure the includeNext value is a number, if not ignore
                if (!Number.isNaN(includeNextSections)) {
                  // We need to take all the sections that make up this block and
                  // append them to a new body element
                  const bodyElement = document.createElement('body');

                  let i = 0;
                  // Append the next x number of siblings to the blockWrapper
                  while (i < includeNextSections) {
                    // Pull out the next sibling and append it to the body element
                    const nextSibling = blockWrapper.nextElementSibling;
                    bodyElement.append(nextSibling);
                    i += 1;
                  }

                  // Prepend the original blockWrapper to the body element
                  bodyElement.prepend(blockWrapper);

                  // Reassign the blockWrapper to the new body element
                  blockWrapper = bodyElement;

                  // Tell the next iteration to skip the next x number of siblings
                  skipNext = includeNextSections;

                  // Remember this is a multi-section block
                  sectionLibraryMetadata.multiSectionBlock = true;
                }
              } else if (blocksInSection > 0) {
                // Ok great.. there is at least one block,
                // but is there also default content or multiple blocks?
                if (blockWrapper.querySelectorAll('body > :scope > p').length > 0 || blocksInSection > 1) {
                // We need to take all the blocks in the section to make up the compound block and
                // append them to a new body element
                  const compoundBodyElement = document.createElement('body');

                  // Take the parent of this block and append to the compound body element
                  compoundBodyElement.append(blockWrapper);

                  // Reassign the blockWrapper to the new body element
                  blockWrapper = compoundBodyElement;

                  // Remember this is a compound block
                  sectionLibraryMetadata.compoundBlock = true;
                }
              }

              // Construct an event payload
              const eventPayload = {
                detail: {
                  blockWrapper,
                  blockNameWithVariant,
                  blockData,
                  blockURL,
                  sectionLibraryMetadata,
                  defaultLibraryMetadata,
                  pageMetadata,
                  index,
                },
              };

              // Set the expected block variant item attributes
              blockVariantItem.classList.add('descendant');
              blockVariantItem.setAttribute('data-index', index);

              // Handle sidenav item actions (copy)
              blockVariantItem.addEventListener('OnAction', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.dispatchEvent(new CustomEvent('CopyBlock', eventPayload));
              });

              // Add child variant to parent
              blockParentItem.append(blockVariantItem);

              // On item click
              blockVariantItem.addEventListener('click', async () => {
                if (this.selectedItem) {
                  this.selectedItem.removeAttribute('selected');
                }
                blockVariantItem.setAttribute('selected', true);
                this.selectedItem = blockVariantItem;
                this.dispatchEvent(new CustomEvent('LoadBlock', eventPayload));
              });

              // If the block path and index match the URL params, load the block
              if (dlPath === path && dlIndex === index.toString()) {
                blockParentItem.setAttribute('expanded', true);
                this.selectedItem = blockVariantItem;
                this.dispatchEvent(new CustomEvent('LoadBlock', eventPayload));
              }
            });
          }

          return blockPromise;
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error(e.message);
          container.dispatchEvent(new CustomEvent('Toast', { detail: { message: e.message, variant: 'negative' } }));
        }
      });

      // Wait for all block loading promises to resolve
      await Promise.all(promises);

      // Sort the templates alphabetically
      if (templatesParentItem) {
        const sortedTemplateChildren = Array.from(templatesParentItem.children)
          .sort((a, b) => a.getAttribute('label').localeCompare(b.getAttribute('label')));

        sortedTemplateChildren?.forEach(child => templatesParentItem.appendChild(child));
      }

      // Sort top level menu items alphabetically
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

      // Seems to be the only way I can set the selected attribute on first load...
      setTimeout(() => {
        if (this.selectedItem) {
          this.selectedItem.setAttribute('selected', true);
        }
      }, 1);

      if (sideNav.querySelectorAll('sp-sidenav-item').length === 0) {
        container.append(this.renderNoResults());
      }
    }

    this.renderRoot?.append(listContainer);
  }
}

customElements.define('block-list', BlockList);
