/*
 * Copyright 2024 Adobe. All rights reserved.
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

/**
 * The `.plain.html` of a block library document on a site that processes section
 * metadata on the server (rendering version 2). The Section Metadata table
 * (`Style: bg-color-brand-dark`) of the two dark variants is not part of the markup,
 * it has been applied to the section as a class.
 */
export const TESTIMONIAL_CAROUSEL_PLAIN_HTML = /* html */`
<div>
  <div class="testimonial-carousel">
    <div>
      <div>Quote</div>
      <div>"I learned so much from this program and the community around it."</div>
    </div>
    <div>
      <div>Cite</div>
      <div>— Jane Smith, Class of 2023</div>
    </div>
    <div>
      <div>Image</div>
      <div><span class="icon icon-logo-on-white"></span></div>
    </div>
    <div>
      <div>Quote</div>
      <div>"The faculty completely changed my career trajectory."</div>
    </div>
    <div>
      <div>Cite</div>
      <div>— John Doe, Program Director</div>
    </div>
    <div>
      <div>Quote</div>
      <div>"Proin euismod auctor nibh, non efficitur est fermentum quis"</div>
    </div>
    <div>
      <div>Cite</div>
      <div>— Phasellus Sapien, Program Director</div>
    </div>
    <div>
      <div>Quote</div>
      <div>"Vivamus faucibus justo quis neque pellentesque luctus"</div>
    </div>
    <div>
      <div>Cite</div>
      <div>— Phasellus Sapien, Program</div>
    </div>
  </div>
  <div class="library-metadata">
    <div>
      <div><strong>name</strong></div>
      <div>Testimonial Carousel</div>
    </div>
    <div>
      <div><strong>description</strong></div>
      <div></div>
    </div>
  </div>
</div>
<div class="bg-color-brand-dark">
  <div class="testimonial-carousel dark">
    <div>
      <div>Quote</div>
      <div>"I learned so much from this program and the community around it."</div>
    </div>
    <div>
      <div>Cite</div>
      <div>— Jane Smith, Class of 2023</div>
    </div>
    <div>
      <div>Image</div>
      <div><span class="icon icon-logo-on-white"></span></div>
    </div>
    <div>
      <div>Quote</div>
      <div>"The faculty completely changed my career trajectory."</div>
    </div>
    <div>
      <div>Cite</div>
      <div>— John Doe, Program Director</div>
    </div>
  </div>
  <div class="library-metadata">
    <div>
      <div><strong>name</strong></div>
      <div>Testimonial Carousel (dark)</div>
    </div>
    <div>
      <div><strong>description</strong></div>
      <div></div>
    </div>
  </div>
</div>
<div>
  <div class="testimonial-carousel round-image">
    <div>
      <div>Quote</div>
      <div>"I learned so much from this program and the community around it."</div>
    </div>
    <div>
      <div>Cite</div>
      <div>— Jane Smith, Class of 2023</div>
    </div>
    <div>
      <div>Image</div>
      <div>
        <picture>
          <source type="image/webp" srcset="./media_19742aba6b311096b94e6b1f3867b8806df53da65.jpg?width=2000&#x26;format=webply&#x26;optimize=medium" media="(min-width: 600px)">
          <source type="image/webp" srcset="./media_19742aba6b311096b94e6b1f3867b8806df53da65.jpg?width=750&#x26;format=webply&#x26;optimize=medium">
          <source type="image/jpeg" srcset="./media_19742aba6b311096b94e6b1f3867b8806df53da65.jpg?width=2000&#x26;format=jpg&#x26;optimize=medium" media="(min-width: 600px)">
          <img loading="lazy" alt="" src="./media_19742aba6b311096b94e6b1f3867b8806df53da65.jpg?width=750&#x26;format=jpg&#x26;optimize=medium" width="1140" height="900">
        </picture>
      </div>
    </div>
    <div>
      <div>Quote</div>
      <div>"The faculty completely changed my career trajectory."</div>
    </div>
    <div>
      <div>Cite</div>
      <div>— John Doe, Program Director</div>
    </div>
  </div>
  <div class="library-metadata">
    <div>
      <div><strong>name</strong></div>
      <div>Testimonial Carousel (round image)</div>
    </div>
    <div>
      <div><strong>description</strong></div>
      <div></div>
    </div>
  </div>
</div>
<div class="bg-color-brand-dark">
  <div class="testimonial-carousel round-image dark">
    <div>
      <div>Quote</div>
      <div>"I learned so much from this program and the community around it."</div>
    </div>
    <div>
      <div>Cite</div>
      <div>— Jane Smith, Class of 2023</div>
    </div>
    <div>
      <div>Image</div>
      <div>
        <picture>
          <source type="image/webp" srcset="./media_19742aba6b311096b94e6b1f3867b8806df53da65.jpg?width=2000&#x26;format=webply&#x26;optimize=medium" media="(min-width: 600px)">
          <source type="image/webp" srcset="./media_19742aba6b311096b94e6b1f3867b8806df53da65.jpg?width=750&#x26;format=webply&#x26;optimize=medium">
          <source type="image/jpeg" srcset="./media_19742aba6b311096b94e6b1f3867b8806df53da65.jpg?width=2000&#x26;format=jpg&#x26;optimize=medium" media="(min-width: 600px)">
          <img loading="lazy" alt="" src="./media_19742aba6b311096b94e6b1f3867b8806df53da65.jpg?width=750&#x26;format=jpg&#x26;optimize=medium" width="1140" height="900">
        </picture>
      </div>
    </div>
    <div>
      <div>Quote</div>
      <div>"The faculty completely changed my career trajectory."</div>
    </div>
    <div>
      <div>Cite</div>
      <div>— John Doe, Program Director</div>
    </div>
  </div>
  <div class="library-metadata">
    <div>
      <div><strong>name</strong></div>
      <div>Testimonial Carousel (round image, dark)</div>
    </div>
    <div>
      <div><strong>description</strong></div>
      <div></div>
    </div>
  </div>
</div>
`;

/**
 * The sections of the document as elements
 */
export const TESTIMONIAL_CAROUSEL_SECTIONS = () => [
  ...createTag('div', undefined, TESTIMONIAL_CAROUSEL_PLAIN_HTML).children,
];
