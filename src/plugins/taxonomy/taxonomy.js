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

const selectedTags = [];

function getSelectedLabel() {
  return selectedTags.length > 0 ? `${selectedTags.length} tag${selectedTags.length > 1 ? 's' : ''} selected` : 'No tags selected';
}

function getFilteredTags(data, query) {
  if (!query) {
    return data;
  }

  return data.filter((item) => item.tag.toLowerCase().includes(query.toLowerCase()));
}

async function decorate(container, data, query) {
  const sp = document.createElement('div');
  sp.classList.add('container');
  sp.innerHTML = /* html */`
        <sp-menu
            label="Select tags"
            selects="multiple"
            >
            ${getFilteredTags(data, query).map((item) => /* html */`<sp-menu-item value="${item.tag}" ${selectedTags.includes(item.tag) ? 'selected' : ''}>${item.tag}</sp-menu-item>`).join('')}
        </sp-menu>
        <sp-divider size="s"></sp-divider>
        <div class="footer">
            <span class="selectedLabel">${getSelectedLabel()}</span>
            <sp-action-button label="Copy" quiet>
                <sp-icon-copy slot="icon"></sp-icon-copy>
            </sp-action-button>
        </div>`;

  const selectedLabel = sp.querySelector('.selectedLabel');
  const items = sp.querySelectorAll('sp-menu-item');
  [...items].forEach((item) => {
    item.addEventListener('click', (e) => {
      const { value, selected } = e.target;
      if (selected) {
        const index = selectedTags.indexOf(value);
        if (index > -1) {
          selectedTags.splice(index, 1);
        }
      } else {
        selectedTags.push(value);
      }

      if (selectedTags.length === 0) {
        selectedLabel.textContent = 'No tags selected';
        return;
      }

      selectedLabel.textContent = getSelectedLabel();
    });
  });

  const copyButton = sp.querySelector('sp-action-button');
  copyButton.addEventListener('click', () => {
    navigator.clipboard.writeText(selectedTags.join(', '));
    // Show toast
    container.dispatchEvent(new CustomEvent('Toast', { detail: { message: 'Copied Tags' } }));
  });
  container.append(sp);
}

export default {
  title: 'Taxonomy',
  searchEnabled: true,
  decorate,
};
