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
import { PLUGIN_LOADED, PLUGIN_UNLOADED } from '../events/events.js';

export async function loadPlugin(appModel, name, path) {
  const { appStore } = appModel;
  const importedPlugin = await import(path);
  appStore.pluginData = appStore.libraries[name];
  appStore.activePluginPath = path;
  appStore.activePlugin = importedPlugin.default;
  EventBus.instance.dispatchEvent(new CustomEvent(PLUGIN_LOADED));
}

export async function unloadPlugin(appModel) {
  const { appStore } = appModel;
  appStore.activePlugin = undefined;
  appStore.pluginData = undefined;
  appStore.activePluginPath = undefined;
  EventBus.instance.dispatchEvent(new CustomEvent(PLUGIN_UNLOADED));
}
