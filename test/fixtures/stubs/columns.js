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

export const COLUMNS_DEFAULT_STUB = createTag('div', { class: 'columns' }, /* html */`
<div>
  <div>
    <h2 id="lorem-ipsum">Lorem Ipsum</h2>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
    <p><a href="https://google.com">SOME LINK</a></p>
  </div>
  <div>
    <picture>
      <source type="image/webp" srcset="./media_158b6ada45d61b7d8a8e27c77af6c6dd3ec33bb6a.jpeg?width=2000&amp;format=webply&amp;optimize=medium" media="(min-width: 600px)">
      <source type="image/webp" srcset="./media_158b6ada45d61b7d8a8e27c77af6c6dd3ec33bb6a.jpeg?width=750&amp;format=webply&amp;optimize=medium">
      <source type="image/jpeg" srcset="./media_158b6ada45d61b7d8a8e27c77af6c6dd3ec33bb6a.jpeg?width=2000&amp;format=jpeg&amp;optimize=medium" media="(min-width: 600px)">
      <img loading="lazy" alt="" src="./media_158b6ada45d61b7d8a8e27c77af6c6dd3ec33bb6a.jpeg?width=750&amp;format=jpeg&amp;optimize=medium" width="7294" height="4863">
    </picture>
  </div>
</div>`);

export const COLUMNS_CENTER_BACKGROUND_STUB = createTag('div', { class: 'columns center background' }, /* html */`
<div>
  <div>
    <h2 id="lorem-ipsum-1">Lorem Ipsum</h2>
    <p>t enim ad minim veniam, quis nostrud exercitation ullamco laboris</p>
    <p><strong><a href="https://hlx.live">A LINK</a></strong></p>
  </div>
  <div>
    <h2 id="dolor-sit-amet">Dolor sit amet</h2>
    <p>t enim ad minim veniam, quis nostrud exercitation ullamco laboris. Ut aliquip ex.</p>
    <p><strong><a href="https://hlx.live">ANOTHER LINK</a></strong></p>
  </div>
</div>`);

export const COLUMNS_ZPATTERN_DARK_STUB = createTag('div', { class: 'columns z-pattern dark' }, /* html */`
<div>
  <div>
    <h2 id="lorem-ipsum-dolor-sit-amet-consectetur-adipiscing-elit">Lorem ipsum dolor sit amet, consectetur adipiscing elit</h2>
    <ul>
      <li>Energy savings</li>
      <li>Asset tracking capability</li>
      <li>Navigation assistance</li>
      <li>Contact tracing</li>
      <li>Occupancy rates and counting</li>
      <li>Productivity data</li>
    </ul>
  </div>
  <div>
    <picture>
      <source type="image/webp" srcset="./media_112ed4f656ce9d61bd623f0a8cc750b4d68e8a02a.jpeg?width=2000&amp;format=webply&amp;optimize=medium" media="(min-width: 600px)">
      <source type="image/webp" srcset="./media_112ed4f656ce9d61bd623f0a8cc750b4d68e8a02a.jpeg?width=750&amp;format=webply&amp;optimize=medium">
      <source type="image/jpeg" srcset="./media_112ed4f656ce9d61bd623f0a8cc750b4d68e8a02a.jpeg?width=2000&amp;format=jpeg&amp;optimize=medium" media="(min-width: 600px)">
      <img loading="lazy" alt="" src="./media_112ed4f656ce9d61bd623f0a8cc750b4d68e8a02a.jpeg?width=750&amp;format=jpeg&amp;optimize=medium" width="3819" height="5728">
    </picture>
  </div>
</div>`);

export const COLUMNS_ZPATTERN_LIGHT_STUB = createTag('div', { class: 'columns z-pattern light' }, /* html */`
<div>
  <div>
    <picture>
      <source type="image/webp" srcset="./media_112ed4f656ce9d61bd623f0a8cc750b4d68e8a02a.jpeg?width=2000&amp;format=webply&amp;optimize=medium" media="(min-width: 600px)">
      <source type="image/webp" srcset="./media_112ed4f656ce9d61bd623f0a8cc750b4d68e8a02a.jpeg?width=750&amp;format=webply&amp;optimize=medium">
      <source type="image/jpeg" srcset="./media_112ed4f656ce9d61bd623f0a8cc750b4d68e8a02a.jpeg?width=2000&amp;format=jpeg&amp;optimize=medium" media="(min-width: 600px)">
      <img loading="lazy" alt="" src="./media_112ed4f656ce9d61bd623f0a8cc750b4d68e8a02a.jpeg?width=750&amp;format=jpeg&amp;optimize=medium" width="3819" height="5728">
    </picture>
  </div>
  <div>
    <h2 id="lorem-ipsum-dolor-sit-amet-consectetur-adipiscing-elit-1">Lorem ipsum dolor sit amet, consectetur adipiscing elit</h2>
    <ul>
      <li>Utility expenses</li>
      <li>Peak demand avoidance</li>
      <li>Energy storage and resilience</li>
    </ul>
  </div>
</div>`);
