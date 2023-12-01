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

export const COMPOUND_BLOCK_STUB = createTag('div', {}, /* html */`
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
  <div class="banner small left">
    <div>
      <div>
        <picture>
          <source type="image/webp" srcset="./media_4.jpeg?width=2000&#x26;format=webply&#x26;optimize=medium" media="(min-width: 600px)">
          <source type="image/webp" srcset="./media_4.jpeg?width=750&#x26;format=webply&#x26;optimize=medium">
          <source type="image/jpeg" srcset="./media_4.jpeg?width=2000&#x26;format=jpeg&#x26;optimize=medium" media="(min-width: 600px)">
          <img loading="lazy" alt="" src="./media_4.jpeg?width=750&#x26;format=jpeg&#x26;optimize=medium" width="1440" height="660">
        </picture>
      </div>
      <div>
        <h1 id="heading-3">Heading</h1>
        <p>Body</p>
        <p><em><a href="/">Secondary</a></em></p>
        <p><strong><a href="/">Primary</a></strong></p>
      </div>
    </div>
  </div>
  <div class="section-metadata">
    <div>
      <div>style</div>
      <div>test</div>
    </div>
    <div>
      <div>something</div>
      <div>foobar</div>
    </div>
  </div>
  <div class="library-metadata">
    <div>
      <div>name</div>
      <div>Compound Block 1</div>
    </div>
  </div>`);
