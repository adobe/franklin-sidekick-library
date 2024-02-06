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

/* eslint-disable import/no-absolute-path, no-param-reassign */

import { LitElement, html, css } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import { createTag } from '../../utils/dom.js';
import { isDev } from '../../utils/library.js';
import AppModel from '../../models/app-model.js';

export class BlockRenderer extends LitElement {
  iframe = createRef();

  static properties = {
    mutationObserver: { state: false },
    blockWrapperHTML: { state: false },
    activeOverlayContent: { state: false },
    selectedContentEditable: { state: false },
    blockData: { state: false },
    isBlock: { state: false, type: Boolean },
    extendedBlock: { state: true, type: Boolean },
  };

  static styles = css`
    iframe {
      width: 100%;
      height: 100%;
      border: none;
      display: none;
    }
  `;

  constructor() {
    super();
    this.state = 'ready';
    this.extendedBlock = false;
    this.mutationObserver = new MutationObserver(this.handleMutations.bind(this));
  }

  /**
   * Replace icons with inline SVG using the origin of the block
   * @param {Element} element
   */
  decorateIcons(element, origin) {
    console.log('calling decorateIcons for block');

    element.querySelectorAll('span.icon').forEach(async (span) => {
      if (span.classList.length < 2 || !span.classList[1].startsWith('icon-')) {
        return;
      }
      const icon = span.classList[1].substring(5);
      const resp = await fetch(`${origin}/icons/${icon}.svg`);
      if (resp.ok) {
        const iconHTML = await resp.text();
        if (iconHTML.match(/<style/i)) {
          const img = document.createElement('img');
          img.src = `data:image/svg+xml,${encodeURIComponent(iconHTML)}`;
          span.appendChild(img);
        } else {
          span.innerHTML = iconHTML;
        }
      }
    });
  }

  /**
   * Decorates the HTML with contentEditable attributes and library ids
   * This will be cloned and then decorated by the block decorator
   * @param {HTMLElement} block The block to decorate
   */
  decorateEditableElements(block) {
    // Make editable elements contentEditable and assign an id
    block?.querySelectorAll('p, li, strong, a, h1, h2, h3, h4, h5, h6').forEach((el) => {
      if (el.textContent.trim() !== '') {
        el.setAttribute('contentEditable', true);
        el.setAttribute('data-library-id', window.crypto.randomUUID());
      }
    });

    // If a button, remove contentEditable from parent elements
    block?.querySelectorAll('a').forEach((el) => {
      const up = el.parentElement;
      const twoup = el.parentElement.parentElement;

      const isUpSingleNodeP = up.childNodes.length === 1 && up.tagName === 'P';
      const isTwoUpSingleNodeP = twoup.childNodes.length === 1 && twoup.tagName === 'P';
      const isTwoUpSingleNodeDiv = twoup.childNodes.length === 1 && twoup.tagName === 'DIV';
      const isUpSingleNodeStrong = up.childNodes.length === 1 && up.tagName === 'STRONG';
      const isUpSingleNodeEm = up.childNodes.length === 1 && up.tagName === 'EM';

      if (isUpSingleNodeP
        || (isTwoUpSingleNodeP && isUpSingleNodeStrong)
        || (isTwoUpSingleNodeDiv && isUpSingleNodeP)
        || (isTwoUpSingleNodeP && isUpSingleNodeEm)) {
        up.removeAttribute('contentEditable');
        up.removeAttribute('data-library-id');
        twoup.removeAttribute('contentEditable');
        twoup.removeAttribute('data-library-id');
      }
    });

    // Assign a library id to img tags
    block?.querySelectorAll('img').forEach((el) => {
      el.setAttribute('data-library-id', window.crypto.randomUUID());
    });
  }

  /**
   * Handles mutations to the Preview DOM
   * @param {MutationCallback} mutations
   */
  handleMutations(mutations) {
    mutations.forEach((mutation) => {
      const { target, type: mutationType } = mutation;
      // Determine the modified library id
      let modifiedLibraryId = mutationType !== 'characterData'
        ? target.getAttribute('data-library-id')
        : target.parentElement.getAttribute('data-library-id');

      const modifiedElementHTML = this.blockWrapperHTML.querySelector(`[data-library-id="${modifiedLibraryId}"]`);
      if (mutationType === 'attributes') {
      // Was an image DND'd?
        if (mutation.attributeName === 'src'
          && target.tagName === 'IMG') {
          modifiedElementHTML.src = target.src;
          modifiedElementHTML.width = target.width;
          modifiedElementHTML.height = target.height;
        }
      // Was page text edited?
      } else if (mutationType === 'characterData') {
      // If we edited text than the library-id exists on the parent, not the target
        modifiedLibraryId = mutation.target.parentElement.getAttribute('data-library-id');
        modifiedElementHTML.innerHTML = mutation.target.parentElement.innerHTML;
      // Did we update an elements childList?
      } else if (mutationType === 'childList') {
        if (mutation.addedNodes.length > 0) {
          modifiedElementHTML?.replaceChildren();
          for (const child of mutation.addedNodes) {
            const clonedContent = child.cloneNode(true);
            if (modifiedElementHTML) {
              modifiedElementHTML.textContent = clonedContent.textContent;
            }
          }
        }
      }
    });
  }

  /**
 * Enables drag and drop of images into the preview
 * @param {HTMLElement} body The preview body
 */
  enableImageDragDrop(body) {
    function killEvent(e) {
      e.preventDefault();
      e.stopPropagation();
    }

    [...body.querySelectorAll('img')].forEach((el) => {
      el.addEventListener('dragover', (e) => {
        // Show outline on dragover
        e.target.style.outline = '4px solid #54a3f6';
        e.target.style.outlineRadius = '8px';
        killEvent(e);
      });
      el.addEventListener('dragleave', (e) => {
        // Hide outline on dragleave
        e.target.style.outline = 'initial';
        e.target.style.outlineRadius = 'initial';
        killEvent(e);
      });
      el.addEventListener('dragenter', e => killEvent(e));
      el.addEventListener('drop', (e) => {
        e.preventDefault();

        e.target.style.outline = 'initial';
        e.target.style.outlineRadius = 'initial';

        const file = e.dataTransfer.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.addEventListener('loadend', () => {
          const image = new Image();
          image.src = reader.result;
          image.addEventListener('load', () => {
            el.setAttribute('width', image.width);
            el.setAttribute('height', image.height);
          });
          el.src = reader.result;

          // Set all picture sources as well
          el.parentElement.querySelectorAll('source').forEach((source) => {
            source.setAttribute('srcset', reader.result);
          });
        });
      });
    });
  }

  /**
   * Fetches the container page HTML
   * @param {String} blockURL
   * @param {String} origin
   * @returns {String} The container page HTML
   */
  async fetchContainerPageMarkup(blockURL, origin) {
    const doc = await fetch(blockURL);
    const containerHTML = await doc.text();

    // Change an relative paths to absolute paths for scripts and styles
    return containerHTML
      .replace(/href="\//g, `href="${origin}/`)
      .replace(/src="\//g, `src="${origin}/`);
  }

  /**
   * Returns the block element
   * @returns {HTMLElement} The block element
   */
  getBlockElement() {
    return this.blockWrapperHTML.querySelector(':scope > div:not(.section-metadata)');
  }

  /**
   * Returns the block wrapper
   * @returns {HTMLElement} The block wrapper
   */
  getBlockWrapper() {
    return this.blockWrapperHTML;
  }

  /**
   * Returns the block data
   * @returns {HTMLElement} The block data
   */
  getBlockData() {
    return this.blockData;
  }

  /**
   * Loads the block into the iframe
   * @param {String} blockName The name of the block
   * @param {Object} blockData The block data
   * @param {HTMLElement} blockWrapper The wrapped block, includes section metadata
   * @param {HTMLElement} hostContainer The host container to render the iframe into
   */
  // eslint-disable-next-line no-unused-vars
  async loadBlock(blockName, blockData, blockWrapper, defaultLibraryMetadata, hostContainer) {
    console.log(`Loading block - ${blockName}`);

    const { context } = AppModel.appStore;
    const { url: blockURL } = blockData;
    const origin = blockData.extended
      ? context.extendedLibraryOrigin
      : context.baseLibraryOrigin;

    // Change all media relative paths to absolute paths in the block
    blockWrapper.innerHTML = blockWrapper.innerHTML
      .replace(/\.\/media/g, `${origin}/media`)
      .replace(/src="\/media/g, `src="${origin}/media`);

    // Store the active block
    this.blockWrapperHTML = blockWrapper;

    // Store the block data
    this.blockData = blockData;

    // Assume what we are trying to load is a block and not an autoblock or default content
    this.isBlock = true;

    // Assign any block to the content by default
    let content = this.getBlockElement();

    // If there is no block, then we are rendering an autoblock, default content or a page
    // Pages contain blocks so we need to explicity check for page type in default metadata
    if (!content || (defaultLibraryMetadata && defaultLibraryMetadata.type === 'template')) {
      this.isBlock = false;

      // Set the element to the block wrapper instead
      content = this.blockWrapperHTML;
    }

    // Add the sidekick-library class to the block element
    const sidekickLibraryClass = 'sidekick-library';
    content?.classList.add(sidekickLibraryClass);

    // Decorate the block with ids
    this.decorateEditableElements(content);

    // Clone the block and decorate it
    const blockClone = blockWrapper.cloneNode(true);

    // Fetch the container page markup
    const containerPageMarkup = await this.fetchContainerPageMarkup(blockURL, origin);
    const containerDocument = new DOMParser().parseFromString(containerPageMarkup, 'text/html');
    const containerDocumentBody = containerDocument.querySelector('body');
    const containerDocumentMain = containerDocument.querySelector('main');

    // Add the sidekick-library class to the body & main element
    containerDocumentBody.classList.add(sidekickLibraryClass);
    containerDocumentMain.classList.add(sidekickLibraryClass);

    // Hide the header and footer
    containerDocument.querySelector('header').style.display = 'none';
    containerDocument.querySelector('footer').style.display = 'none';

    // Replace the children of the main element with our decorated block
    containerDocumentMain.replaceChildren(blockClone);

    // Set the srcdoc to our container document
    const { value: frame } = this.iframe;
    frame.srcdoc = containerDocument.documentElement.outerHTML;
    frame.style.display = 'block';

    // When the iframe loads, replace the iframe body with the block
    frame.addEventListener('load', () => {
      const { contentWindow: iframeWindow } = frame;
      const { body: iframeBody } = iframeWindow.document;

      // When in dev mode, decorate icons with page origin
      /* c8 ignore next 3 */
      if (isDev()) {
        this.decorateIcons(iframeBody, origin);
      }

      // On scroll remove the popover
      frame.contentDocument.addEventListener('scroll', () => {
        if (this.activeOverlayContent) {
          this.activeOverlayContent.remove();
        }

        if (this.selectedContentEditable) {
          this.selectedContentEditable.blur();
        }
      });

      // On focus remove the popover
      iframeWindow.addEventListener('focus', () => {
        if (this.activeOverlayContent) {
          this.activeOverlayContent.remove();
        }
      });

      // Disable enter key on contenteditable
      frame.contentDocument.querySelectorAll('p, strong, li, a, h1, h2, h3, h4, h5, h6').forEach((el) => {
        el.addEventListener('keydown', (e) => { if (e.keyCode === 13) e.preventDefault(); });
      });

      // Disable click events on buttons or anchor tags
      frame.contentDocument.querySelectorAll('a, button').forEach((el) => {
        el.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
        });
      });

      // Enable drag and drop on images
      this.enableImageDragDrop(iframeBody);

      // Observe the block for changes
      this.mutationObserver.observe(iframeBody, {
        subtree: true,
        attributes: true,
        childList: true,
        characterData: true,
        characterDataOldValue: true,
      });

      // Get the hlx object from the iframe
      const { window: { window: { hlx } } } = iframeWindow;

      // Load the block and lazy CSS
      const codePath = `${origin}${hlx?.codeBasePath ?? ''}`;

      // If we are in dev mode will need to manually load the block CSS
      // If we are loading a template the blockName will be an empty string, in this case
      // we don't want to load the block CSS
      if (isDev() && blockName !== '') {
        const styleLink = createTag('link', { rel: 'stylesheet', href: `${codePath}/blocks/${blockName}/${blockName}.css` });
        frame.contentWindow.document.head.append(styleLink);
      }

      // Since these requests happen in the iframe there is no way to mock the responses in a test
      /* c8 ignore next 32 */
      // Load the lazy CSS
      const lazyStyleLink = createTag('link', { rel: 'stylesheet', href: `${codePath}/styles/lazy-styles.css` });
      frame.contentWindow.document.head.append(lazyStyleLink);

      lazyStyleLink.onload = () => {
        // Show the iframe
        frame.style.display = 'block';

        // When in dev mode, we need to change the relative urls of the images to absolute
        if (isDev()) {
          frame.contentDocument.querySelectorAll('source').forEach((el) => {
            const srcset = el.getAttribute('srcset');
            if (srcset.startsWith('/media')) {
              el.setAttribute('srcset', `${origin}${srcset}`);
            }
          });
        }

        // Images created with createOptimizedImage will have a src that starts with /media
        frame.contentDocument.querySelectorAll('img').forEach((el) => {
          const src = el.getAttribute('src');
          if (src.startsWith('/media')) {
            el.src = `${origin}${src}`;
          }
        });
      };
      lazyStyleLink.onerror = (e) => {
        // eslint-disable-next-line no-console
        console.error(e);
      };
    });
  }

  render() {
    return html`<iframe title="block" ${ref(this.iframe)}></iframe>`;
  }
}

customElements.define('block-renderer', BlockRenderer);
