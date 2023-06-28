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

export const DEFAULT_CONTENT_STUB = createTag('div', {}, /* html */`
<p>
  <picture>
    <source type="image/webp" srcset="./media_1dda29fc47b8402ff940c87a2659813e503b01d2d.png?width=2000&#x26;format=webply&#x26;optimize=medium" media="(min-width: 600px)">
    <source type="image/webp" srcset="./media_1dda29fc47b8402ff940c87a2659813e503b01d2d.png?width=750&#x26;format=webply&#x26;optimize=medium">
    <source type="image/png" srcset="./media_1dda29fc47b8402ff940c87a2659813e503b01d2d.png?width=2000&#x26;format=png&#x26;optimize=medium" media="(min-width: 600px)">
    <img loading="lazy" alt="" src="./media_1dda29fc47b8402ff940c87a2659813e503b01d2d.png?width=750&#x26;format=png&#x26;optimize=medium" width="584" height="482">
  </picture>
</p>
<h1 id="this-is-a-heading">This is a heading</h1>
<p>Some text about a subject</p>
<p><strong><a href="https://www.hlx.live">Get Started</a></strong></p>
<p><em><a href="https://www.hlx.live">Request Demo</a></em></p>
<p><span class="icon icon-home"></span></p>`);

export const DEFAULT_CONTENT_STUB_WITH_LIBRARY_METADATA = createTag('div', {}, /* html */`
<p>
  <picture>
    <source type="image/webp" srcset="./media_1dda29fc47b8402ff940c87a2659813e503b01d2d.png?width=2000&#x26;format=webply&#x26;optimize=medium" media="(min-width: 600px)">
    <source type="image/webp" srcset="./media_1dda29fc47b8402ff940c87a2659813e503b01d2d.png?width=750&#x26;format=webply&#x26;optimize=medium">
    <source type="image/png" srcset="./media_1dda29fc47b8402ff940c87a2659813e503b01d2d.png?width=2000&#x26;format=png&#x26;optimize=medium" media="(min-width: 600px)">
    <img loading="lazy" alt="" src="./media_1dda29fc47b8402ff940c87a2659813e503b01d2d.png?width=750&#x26;format=png&#x26;optimize=medium" width="584" height="482">
  </picture>
</p>
<h1 id="this-is-a-heading">This is a heading</h1>
<p>Some text about a subject</p>
<p><strong><a href="https://www.hlx.live">Get Started</a></strong></p>
<p><em><a href="https://www.hlx.live">Request Demo</a></em></p>
<p><span class="icon icon-home"></span></p>
<div class="library-metadata">
  <div>
    <div>name</div>
    <div>Home Hero</div>
  </div>
</div>`);

export const DEFAULT_CONTENT_STUB_WITH_SECTION_METADATA = createTag('div', {}, /* html */`
<p>
  <picture>
    <source type="image/webp" srcset="./media_1dda29fc47b8402ff940c87a2659813e503b01d2d.png?width=2000&#x26;format=webply&#x26;optimize=medium" media="(min-width: 600px)">
    <source type="image/webp" srcset="./media_1dda29fc47b8402ff940c87a2659813e503b01d2d.png?width=750&#x26;format=webply&#x26;optimize=medium">
    <source type="image/png" srcset="./media_1dda29fc47b8402ff940c87a2659813e503b01d2d.png?width=2000&#x26;format=png&#x26;optimize=medium" media="(min-width: 600px)">
    <img loading="lazy" alt="" src="./media_1dda29fc47b8402ff940c87a2659813e503b01d2d.png?width=750&#x26;format=png&#x26;optimize=medium" width="584" height="482">
  </picture>
</p>
<h1 id="this-is-a-heading">This is a heading</h1>
<p>Some text about a subject</p>
<p><strong><a href="https://www.hlx.live">Get Started</a></strong></p>
<p><em><a href="https://www.hlx.live">Request Demo</a></em></p>
<p><span class="icon icon-home"></span></p>
<div class="section-metadata">
  <div>
    <div>name</div>
    <div>Home Hero</div>
  </div>
</div>`);
