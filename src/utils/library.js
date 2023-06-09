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

/* eslint-disable no-param-reassign */

import { EventBus } from '../events/eventbus.js';
import { APP_EVENTS, PLUGIN_EVENTS } from '../events/events.js';
import AppModel from '../models/app-model.js';
import { isPath } from './dom.js';

/**
 * Fetches a library JSON from a URL
 * @param {String} href The url or path to the library JSON
 * @returns The library JSON
 */
export async function fetchLibrary(href) {
  const resp = await fetch(href);
  if (resp.status === 401) {
    fetchWithCredentials(href);
  } else if (!resp.ok) throw new Error('unable to load library JSON');
  return resp.json();
}

/**
 * Fetches a library JSON from a URL with credentials
 * @param {String} href The url or path to the library JSON
 * @returns The library JSON
 */
async function fetchWithCredentials(href) {
  const resp = await fetch(href, { credentials: 'include' });
  if (resp.status === 401) {
    window.open(new URL(origin).origin, '_self');
  } else if (!resp.ok) throw new Error('unable to load library JSON');
  return resp.json();
}

/**
 * Fetches an extended library (if defined)
 * @param {String} href The url to the extended library
 * @returns The extended library JSON
 */
export async function fetchBaseLibrary(context) {
  const { base: href } = context;

  // Base library config could be a path or a URL
  const base = await fetchLibrary(isPath(href) ? `${context.baseLibraryOrigin}${href}` : href);

  // Is it a single sheet or multi sheet library?
  const blocks = base.data ? base : base.blocks;

  if (blocks) {
    blocks.data.forEach((block) => {
      if (block.path) {
        if (block.path.includes('://')) {
          block.path = new URL(block.path).pathname;
        }
        block.url = `${context.baseLibraryOrigin}${block.path}`;
        block.path = `${block.path}`;
        block.extended = false;
      }
    });
  }
  return base;
}

/**
 * Fetches an extended library (if defined)
 * @param {String} href The url to the extended library
 * @returns The extended library JSON
 */
export async function fetchExtendedLibrary(context) {
  if (context.extends) {
    const { extends: href } = context;
    const { origin } = new URL(href);
    const extended = await fetchLibrary(href);

    // Is it a single sheet or multi sheet library?
    const blocks = extended.data ? extended : extended.blocks;

    if (blocks) {
      blocks.data.forEach((block) => {
        const { path } = block;
        if (path) {
          const isPathStr = isPath(path);
          block.url = isPathStr ? `${origin}${path}` : path;
          block.path = isPathStr ? `${path}` : new URL(path).pathname;
          block.extended = true;
        }
      });
    }

    // Set the extended library origin
    context.extendedLibraryOrigin = origin;

    return extended;
  }

  return Promise.resolve();
}

/**
 * Combines a base library and an extended library
 * @param {Object} base The base library JSON
 * @param {Object} supplied The extended library JSON
 * @returns The combined library JSON
 */
export async function combineLibraries(base, supplied) {
  const library = {};

  if (base[':type'] === 'multi-sheet') {
    for (const key of base[':names']) {
      library[key] = base[key].data;
    }
  } else {
    library.blocks = base.data;
  }

  if (supplied) {
    if (supplied[':type'] === 'multi-sheet') {
      for (const key of supplied[':names']) {
        if (library[key]) {
          library[key].push(...supplied[key].data);
        } else {
          library[key] = supplied[key].data;
        }
      }
    } else {
      library.blocks = [...(library.blocks || []), ...supplied.data];
    }
  }

  return library;
}

/**
 * Are we currently running in dev mode?
 * @returns True if yes
 */
export function isDev() {
  return window.libraryDev;
}

/**
 * Loads the provided libraries
 * @param {AppModel} appModel The app model
 * @param {Object} config The config data
 */
export async function loadLibrary() {
  const { context } = AppModel.appStore;

  context.baseLibraryOrigin = isDev()
    ? new URL(context.base).origin
    : window.location.origin;

  try {
    const baseLibrary = await fetchBaseLibrary(context);
    const extendedLibrary = await fetchExtendedLibrary(context);
    context.libraries = await combineLibraries(baseLibrary, extendedLibrary);

    // Dispatch the library loaded event
    EventBus.instance.dispatchEvent(new CustomEvent(APP_EVENTS.LIBRARY_LOADED));
  } catch (error) {
    // Unable to load library
    EventBus.instance.dispatchEvent(new CustomEvent(PLUGIN_EVENTS.TOAST, {
      detail: {
        variant: 'negative',
        message: AppModel.appStore.localeDict.errorLoadingLibraryJSON,
      },
    }));

    // eslint-disable-next-line no-console
    console.error('Unable to load library', error);
  }
}
