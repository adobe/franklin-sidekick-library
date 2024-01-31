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

export const TEMPLATE_STUB = createTag('div', {}, /* html */`
<div>
   <h1 id="my-blog-post-about-a-subject">My blog post about a subject</h1>
   <p>
      <picture>
         <source type="image/webp" srcset="./media_1.jpeg?width=2000&#x26;format=webply&#x26;optimize=medium" media="(min-width: 600px)">
         <source type="image/webp" srcset="./media_1.jpeg?width=750&#x26;format=webply&#x26;optimize=medium">
         <source type="image/jpeg" srcset="./media_1.jpeg?width=2000&#x26;format=jpeg&#x26;optimize=medium" media="(min-width: 600px)">
         <img loading="lazy" alt="" src="./media_1.jpeg?width=750&#x26;format=jpeg&#x26;optimize=medium" width="1600" height="1200">
      </picture>
   </p>
   <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
   <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
   <div class="blockquote">
      <div>
         <div>
            <p>“I believe, ‘Why?’ is one of the most creative questions a person can ask. People generally think of science and creativity as opposing forces, but when I’m developing a hypothesis about Adobe’s customers, I’m drawing on all the knowledge and imagination at my disposal to see the world through their eyes.”</p>
            <p><strong>- Steve Smith</strong></p>
         </div>
      </div>
   </div>
   <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
   <div class="section-metadata">
      <div>
         <div>foo</div>
         <div>bar</div>
      </div>
   </div>
</div>
<div>
   <div class="library-metadata">
      <div>
         <div>type</div>
         <div>template</div>
      </div>
      <div>
         <div>searchtags</div>
         <div>foo, bar</div>
      </div>
   </div>
</div>
<div>
   <div class="page-metadata">
      <div>
         <div>Title</div>
         <div>&#x3C;Title of blog post></div>
      </div>
      <div>
         <div>Description</div>
         <div>&#x3C;Description of blog post></div>
      </div>
      <div>
         <div>Category</div>
         <div>&#x3C;Category of blog post></div>
      </div>
      <div>
         <div>Template</div>
         <div>blog-post</div>
      </div>
      <div>
         <div>Tags</div>
         <div>tag1, tag2, tag3</div>
      </div>
      <div>
         <div>Author</div>
         <div>&#x3C;Blog post author></div>
      </div>
      <div>
         <div>Publication Date</div>
         <div>mm-dd-yy</div>
      </div>
   </div>
</div>
`);
