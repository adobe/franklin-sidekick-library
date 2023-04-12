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

export const findAllDeep = (parent, selectors, depth = null) => {
  const nodes = new Set();
  const currentDepth = 1;
  const recordResult = (nodesArray) => {
    for (const node of nodesArray) {
      nodes.add(node);
    }
  };
  const recursiveSeek = (_parent) => {
    // check for selectors in lightdom
    recordResult(_parent.querySelectorAll(selectors));
    if (_parent.shadowRoot) {
      // check for selectors in shadowRoot
      recordResult(_parent.shadowRoot.querySelectorAll(selectors));
      // look for nested components with shadowRoots
      for (const child of [..._parent.shadowRoot.querySelectorAll('*')].filter((i) => i.shadowRoot)) {
        // make sure we haven't hit our depth limit
        if (depth === null || currentDepth < depth) {
          recursiveSeek(child);
        }
      }
    }
  };
  recursiveSeek(parent);
  return nodes;
};

export const recursiveQuery = (element, selector) => findAllDeep(
  element,
  selector,
  10,
).values().next().value;

export const recursiveQueryAll = (element, selector) => findAllDeep(
  element,
  selector,
  10,
);
