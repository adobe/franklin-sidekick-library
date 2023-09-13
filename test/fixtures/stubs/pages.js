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

export const stubHead = (blockName = 'cards') => /* html */`
    <head>
      <title>Lorem ipsum dolor sit amet</title>
      <link rel="canonical" href="https://example.hlx.test/blocks/${blockName}/${blockName}">
      <meta name="description" content="Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi ...">
      <meta property="og:title" content="Lorem ipsum dolor sit amet">
      <meta property="og:description" content="Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi ...">
      <meta property="og:url" content="https://example.hlx.test/blocks/${blockName}/${blockName}">
      <meta property="og:image" content="https://example.hlx.test/blocks/${blockName}/${blockName}/media_1b75ba147e2eed6fd71c7f0264441ea63155a85e0.jpeg?width=1200&#x26;format=pjpg&#x26;optimize=medium">
      <meta property="og:image:secure_url" content="https://example.hlx.test/blocks/${blockName}/${blockName}/media_1b75ba147e2eed6fd71c7f0264441ea63155a85e0.jpeg?width=1200&#x26;format=pjpg&#x26;optimize=medium">
      <meta property="og:image:alt" content="black and red cherries on white bowl">
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:title" content="Lorem ipsum dolor sit amet">
      <meta name="twitter:description" content="Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi ...">
      <meta name="twitter:image" content="https://example.hlx.test/blocks/${blockName}/${blockName}/media_1b75ba147e2eed6fd71c7f0264441ea63155a85e0.jpeg?width=1200&#x26;format=pjpg&#x26;optimize=medium">
      <script src="/scripts/scripts.js" type="module"></script>
    </head>
  `;

export const stubPage = (head, blocks) => /* html */`<!DOCTYPE html>
<html>
  ${head}
  <body>
    <header></header>
    <main>${blocks.map(block => block.outerHTML).join('\n')}</main>
    <footer></footer>
  </body>
</html>
`;
