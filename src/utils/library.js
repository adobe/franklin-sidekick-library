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
import { APP_EVENTS } from '../events/events.js';

export async function fetchLibrary(href) {
  const resp = await fetch(href);
  if (!resp.ok) return null;
  return resp.json();
}

export async function getExtendedLibrary(href) {
  if (href) {
    return fetchLibrary(href);
  }

  return Promise.resolve();
}

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

export function isDev() {
  return window.libraryDev;
}

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
    // eslint-disable-next-line no-console
    console.error('unable to load library', error);
  }
}
