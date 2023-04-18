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

import { EventBus } from '../events/eventbus.js';
import { APP_EVENTS, PLUGIN_EVENTS } from '../events/events.js';

/**
 * Fetches a library JSON from a URL
 * @param {String} href The url to the library JSON
 * @returns The library JSON
 */
export async function fetchLibrary(href) {
  const resp = await fetch(href);
  if (!resp.ok) throw new Error('unable to load library JSON');
  return resp.json();
}

/**
 * Fetches an extended library (if defined)
 * @param {String} href The url to the extended library
 * @returns The extended library JSON
 */
export async function getExtendedLibrary(href) {
  if (href) {
    return fetchLibrary(href);
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
export async function loadLibrary(appModel, config) {
  const { appStore } = appModel;
  let { libraries } = appModel;

  appStore.config = config;
  try {
    const baseLibrary = await fetchLibrary(config.base);
    const extendedLibrary = await getExtendedLibrary(config.extends);
    libraries = await combineLibraries(baseLibrary, extendedLibrary);
    appStore.libraries = libraries;
    EventBus.instance.dispatchEvent(new CustomEvent(APP_EVENTS.LIBRARY_LOADED));
  } catch (error) {
    EventBus.instance.dispatchEvent(new CustomEvent(PLUGIN_EVENTS.TOAST, {
      detail: {
        variant: 'negative',
        message: appModel.appStore.localeDict.errorLoadingLibraryJSON,
      },
    }));

    // eslint-disable-next-line no-console
    console.error('Unable to load library', error);
  }
}
