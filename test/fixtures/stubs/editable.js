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

export const ALL_EDITABLE_STUB = createTag('div', { class: 'all-editable-elements' }, /* html */`
<div>
  <div>
    <picture>
      <source type="image/webp" srcset="./media_1.jpeg?width=2000&amp;format=webply&amp;optimize=medium" media="(min-width: 600px)">
      <source type="image/webp" srcset="./media_1.jpeg?width=750&amp;format=webply&amp;optimize=medium">
      <source type="image/jpeg" srcset="./media_1.jpeg?width=2000&amp;format=jpeg&amp;optimize=medium" media="(min-width: 600px)">
      <img loading="lazy" alt="A fast-moving Tunnel" src="./media_1.jpeg?width=750&amp;format=jpeg&amp;optimize=medium" width="1600" height="909" data-library-id="95437115-2360-41fc-b400-2a7d62c37209">
    </picture>
    <h1>Unmatched speed</h1>
    <h2>Helix is the fastest way to publish, create, and serve websites</h2>
    <h3>Some content</h3>
    <h4>Some more content</h4>
    <h5>Some more content</h5>
    <h6>Some more content</h6>
    <p>A paragraph <strong>bold</strong></p>
    <ul>
      <li>foo</li>
      <li>bar</li>
    </ul>
    <a href="https://www.adobe.com">Adobe</a>
    <p><a href="https://www.aem.live">Just a link</a></p>
    <p><strong><a href="https://www.aem.live">A Bold Link</a></strong></p>
    <p><a href="https://www.aem.live"><em>A Italic Link</em></a></p>
    <p><em><a href="https://www.aem.live"><strong>A Bold and Italic Link</strong></a></em></p>
    <span class="icon icon-arrow"></span>
  </div>
</div>
`);
