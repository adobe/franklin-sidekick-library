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

import { createTag } from '../../../src/utils/dom.js';

export const TABS_DEFAULT_STUB_SECTION_1 = createTag('div', {}, /* html */`
<div>
  <div class="tabs">
    <div>
      <div>
        <ol>
          <li>First tab title</li>
          <li>Second tab title</li>
          <li>Third tab title</li>
        </ol>
      </div>
    </div>
    <div>
      <div>Active tab</div>
      <div>1</div>
    </div>
    <div>
      <div>id</div>
      <div>tab-demo</div>
    </div>
  </div>
  <div class="library-metadata">
    <div>
      <div>Include next sections</div>
      <div>3</div>
    </div>
  </div>
</div>
`);

export const TABS_DEFAULT_STUB_SECTION_2 = createTag('div', {}, /* html */`
<div>
  <p>Tab 1 content</p>
  <div class="section-metadata">
    <div>
      <div>tab</div>
      <div>tab-demo, 1</div>
    </div>
  </div>
</div>`);

export const TABS_DEFAULT_STUB_SECTION_3 = createTag('div', {}, /* html */`
<div>
  <h2 id="tab-2-content">Tab 2 content</h2>
  <div class="z-pattern">
    <div>
      <div>
        <picture>
          <source type="image/webp" srcset="./media_1.jpeg?width=2000&#x26;format=webply&#x26;optimize=medium" media="(min-width: 600px)">
          <source type="image/webp" srcset="./media_1.jpeg?width=750&#x26;format=webply&#x26;optimize=medium">
          <source type="image/jpeg" srcset="./media_1.jpeg?width=2000&#x26;format=jpeg&#x26;optimize=medium" media="(min-width: 600px)">
          <img loading="lazy" alt="" src="./media_1.jpeg?width=750&#x26;format=jpeg&#x26;optimize=medium" width="600" height="300">
        </picture>
      </div>
      <div>
        <p><strong>Eyebrow</strong></p>
        <h2 id="heading">Heading</h2>
        <p>Lorem ipsum dolor sit amet, consetetur <strong>sadipscing</strong> elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.</p>
        <p><strong><a href="https://adobe.com/">learn more</a></strong></p>
      </div>
    </div>
    <div>
      <div>
        <picture>
          <source type="image/webp" srcset="./media_2.jpeg?width=2000&#x26;format=webply&#x26;optimize=medium" media="(min-width: 600px)">
          <source type="image/webp" srcset="./media_2.jpeg?width=750&#x26;format=webply&#x26;optimize=medium">
          <source type="image/jpeg" srcset="./media_2.jpeg?width=2000&#x26;format=jpeg&#x26;optimize=medium" media="(min-width: 600px)">
          <img loading="lazy" alt="" src="./media_2.jpeg?width=750&#x26;format=jpeg&#x26;optimize=medium" width="600" height="300">
        </picture>
      </div>
      <div>
        <p><strong>Eyebrow</strong></p>
        <h2 id="heading-1">Heading</h2>
        <p>Lorem ipsum dolor sit amet, consetetur <strong>sadipscing</strong> elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.</p>
        <p><strong><a href="https://adobe.com/">learn more</a></strong></p>
      </div>
    </div>
    <div>
      <div>
        <picture>
          <source type="image/webp" srcset="./media_3.jpeg?width=2000&#x26;format=webply&#x26;optimize=medium" media="(min-width: 600px)">
          <source type="image/webp" srcset="./media_3.jpeg?width=750&#x26;format=webply&#x26;optimize=medium">
          <source type="image/jpeg" srcset="./media_3.jpeg?width=2000&#x26;format=jpeg&#x26;optimize=medium" media="(min-width: 600px)">
          <img loading="lazy" alt="" src="./media_3.jpeg?width=750&#x26;format=jpeg&#x26;optimize=medium" width="600" height="300">
        </picture>
      </div>
      <div>
        <p><strong>Eyebrow</strong></p>
        <h2 id="heading-2">Heading</h2>
        <p>Lorem ipsum dolor sit amet, consetetur <strong>sadipscing</strong> elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.</p>
        <p><strong><a href="https://adobe.com/">learn more</a></strong></p>
      </div>
    </div>
  </div>
  <div class="section-metadata">
    <div>
      <div>tab</div>
      <div>tab-demo, 2</div>
    </div>
  </div>
</div>`);

export const TABS_DEFAULT_STUB_SECTION_4 = createTag('div', {}, /* html */`
<div>
  <p>Tab 3 content</p>
  <div class="section-metadata">
    <div>
      <div>tab</div>
      <div>tab-demo, 3</div>
    </div>
  </div>
</div>
<div>
  <div class="library-metadata">
    <div>
      <div>name</div>
      <div>Tabs</div>
    </div>
    <div>
      <div>type</div>
      <div>page</div>
    </div>
  </div>
</div>`);
