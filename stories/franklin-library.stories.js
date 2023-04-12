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
import {
  waitFor, userEvent,
} from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import '../src/app.js';
import { recursiveQuery, recursiveQueryAll } from './test-utils.js';

export default {
  title: 'FranklinLibrary',
  component: 'franklin-library',
};

async function testBaseLibrary(library) {
  await waitFor(() => {
    expect(library).toBeInTheDocument();
    expect(recursiveQuery(library, 'sp-icon-chevron-right')).toBeInTheDocument();
  });

  expect(recursiveQuery(library, 'library-header')).toBeInTheDocument();
  expect(recursiveQuery(library, '.logo-container')).toBeInTheDocument();
  expect(recursiveQuery(library, '.logo-container sp-icon')).toBeInTheDocument();

  const sideNav = recursiveQuery(library, 'nav');
  expect(sideNav).toBeInTheDocument();
}

export const Default = {
  render: () => {
    const library = document.createElement('franklin-library');
    library.config = {
      library: 'https://main--helix-test-content-onedrive--adobe.hlx.page/block-library-tests/library-single-sheet.json',
    };
    return library;
  },
  play: async () => {
    const library = document.querySelector('franklin-library');
    testBaseLibrary(library);
  },
};

export const NoConfig = {
  render: () => {
    const library = document.createElement('franklin-library');
    return library;
  },
  play: async () => {
    const library = document.querySelector('franklin-library');
    await waitFor(() => {
      expect(library).toBeInTheDocument();
    });
    await waitFor(() => expect(recursiveQuery(library, 'illustrated-message')).toBeVisible());
  },
};

export const SingleSheet = {
  render: () => {
    const library = document.createElement('franklin-library');
    library.config = {
      library: 'https://main--helix-test-content-onedrive--adobe.hlx.page/block-library-tests/library-single-sheet.json',
    };
    return library;
  },
  play: async () => {
    const library = document.querySelector('franklin-library');
    testBaseLibrary(library);

    const sideNav = recursiveQuery(library, 'nav');
    waitFor(() => expect(sideNav).toBeInTheDocument()).then(() => {
      const slot = sideNav.querySelector('slot');

      setTimeout(async () => {
        const items = slot.assignedElements();
        expect(items.length).toEqual(1);
        const item = items[0];
        userEvent.click(item);

        const plugin = recursiveQuery(library, 'plugin-renderer');
        await waitFor(() => {
          const pluginItems = recursiveQueryAll(plugin, 'sp-sidenav-item');
          expect([...pluginItems].length).toEqual(12);

          const pluginTitle = recursiveQuery(library, '.title span');
          expect(pluginTitle.textContent).toEqual('Blocks');
        });
      }, 1000);
    });
  },
};

export const MultiSheet = {
  render: () => {
    const library = document.createElement('franklin-library');
    library.config = {
      library: 'https://main--helix-test-content-onedrive--adobe.hlx.page/block-library-tests/library-multi-sheet.json',
    };
    return library;
  },
  play: async () => {
    const library = document.querySelector('franklin-library');
    await waitFor(() => expect(library).toBeInTheDocument());
    testBaseLibrary(library);

    const sideNav = recursiveQuery(library, 'nav');
    waitFor(() => expect(sideNav).toBeInTheDocument()).then(() => {
      const slot = sideNav.querySelector('slot');

      setTimeout(async () => {
        const items = slot.assignedElements();
        expect(items.length).toEqual(2);
        const item = items[1];
        userEvent.click(item);

        const plugin = recursiveQuery(library, 'plugin-renderer');
        await waitFor(() => {
          const pluginItems = recursiveQueryAll(plugin, 'sp-sidenav-item');
          expect([...pluginItems].length).toEqual(12);

          const pluginTitle = recursiveQuery(library, '.title span');
          expect(pluginTitle.textContent).toEqual('Blocks');
        });
      }, 1000);
    });
  },
};

export const UnknownPlugin = {
  render: () => {
    const library = document.createElement('franklin-library');
    library.config = {
      library: 'https://main--helix-test-content-onedrive--adobe.hlx.page/block-library-tests/library-multi-sheet-unknown-plugin.json',
    };
    return library;
  },
  play: async () => {
    const library = document.querySelector('franklin-library');
    testBaseLibrary(library);

    const sideNav = recursiveQuery(library, 'nav');
    waitFor(() => expect(sideNav).toBeInTheDocument()).then(() => {
      const items = sideNav.querySelector('slot');

      setTimeout(async () => {
        expect(items.assignedElements().length).toEqual(3);
        const item1 = items.values().next().value;
        userEvent.click(item1);

        const toast = recursiveQuery(library, 'sp-toast');
        expect(toast).toBeInTheDocument();
        expect(toast.getAttribute('variant')).toEqual('negative');
      }, 1000);
    });
  },
};

export const UnloadPlugin = {
  render: () => {
    const library = document.createElement('franklin-library');
    library.config = {
      library: 'https://main--helix-test-content-onedrive--adobe.hlx.page/block-library-tests/library-single-sheet.json',
    };
    return library;
  },
  play: async () => {
    const library = document.querySelector('franklin-library');
    testBaseLibrary(library);

    const sideNav = recursiveQuery(library, 'nav');
    waitFor(() => expect(sideNav).toBeInTheDocument()).then(() => {
      const slot = sideNav.querySelector('slot');

      setTimeout(async () => {
        const items = slot.assignedElements();
        expect(items.length).toEqual(1);
        const item = items[0];
        userEvent.click(item);

        const plugin = recursiveQuery(library, 'plugin-renderer');
        await waitFor(() => {
          const pluginItems = recursiveQueryAll(plugin, 'sp-sidenav-item');
          expect([...pluginItems].length).toEqual(12);

          const pluginTitle = recursiveQuery(library, '.title span');
          expect(pluginTitle.textContent).toEqual('Blocks');

          setTimeout(() => {
            const backButton = recursiveQuery(library, 'sp-action-button');
            userEvent.click(backButton);

            setTimeout(() => {
              const backTitle = recursiveQuery(library, '.title span');
              expect(backTitle.textContent).toEqual('Libraries');
            }, 2000);
          }, 2000);
        });
      }, 1000);
    });
  },
};

export const Search = {
  render: () => {
    const library = document.createElement('franklin-library');
    library.config = {
      library: 'https://main--helix-test-content-onedrive--adobe.hlx.page/block-library-tests/library-single-sheet.json',
    };
    return library;
  },
  play: async () => {
    const library = document.querySelector('franklin-library');
    testBaseLibrary(library);

    const sideNav = recursiveQuery(library, 'nav');
    waitFor(() => expect(sideNav).toBeInTheDocument()).then(() => {
      const slot = sideNav.querySelector('slot');

      setTimeout(async () => {
        const items = slot.assignedElements();
        const item = items[0];
        userEvent.click(item);
        expect(items.length).toEqual(1);

        await waitFor(() => {
          const searchButton = recursiveQuery(library, '#searchButton');
          userEvent.click(searchButton);

          const searchField = recursiveQuery(library, 'sp-search');
          expect(searchField).toBeVisible();

          setTimeout(async () => {
            const input = recursiveQuery(searchField, 'input');
            await userEvent.type(input, 'back{enter}', {
              delay: 100,
            });
          }, 1000);
        });
      }, 1000);
    });
  },
};
