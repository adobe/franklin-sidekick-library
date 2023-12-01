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
import AppModel from '../models/app-model.js';
import { isDev } from './library.js';
import { isPath } from './dom.js';

/**
 * Attempts to get the path to a plugin from the config
 * @param {String} pluginName The name of the plugin
 * @param {Object} contex The context object
 * @returns {String} The path to the plugin
 */
export function getPluginPathFromConfig(pluginName, context) {
  const configPlugin = context[pluginName];
  if (!configPlugin) {
    return undefined;
  }

  return isPath(configPlugin) ? `${context.baseLibraryOrigin}${configPlugin}` : configPlugin;
}

/**
 * Attempts to get the path to a plugin from the plugins object in the context
 * @param {String} pluginName The name of the plugin
 * @param {Object} context The context object
 * @returns {String | undefined} The path to the plugin
 */
export function getPluginPathFromPlugins(pluginName, context) {
  const plugin = context.plugins[pluginName];
  if (plugin && 'src' in plugin) {
    const { src } = plugin;
    return isPath(src) ? `${context.baseLibraryOrigin}${src}` : src;
  }
  return undefined;
}

/**
 * Loads a plugin into the application
 * @param {AppModel} appModel The app model
 * @param {String} name The name of the plugin
 * @param {String} path The path to the plugin
 */
export async function loadPlugin(appModel, name) {
  const { appStore } = appModel;
  const { context } = appStore;

  const defaultPlugins = {
    blocks: isDev() ? '../../src/plugins/blocks/blocks.js' : `${AppModel.libraryHost}/plugins/blocks/blocks.js`,
    tags: isDev() ? '../../src/plugins/tags/tags.js' : `${AppModel.libraryHost}/plugins/tags/tags.js`,
    'api-test': isDev() ? '../../src/plugins/api-test/api-test.js' : `${AppModel.libraryHost}/plugins/api-test/api-test.js`,
  };

  // First try and load plugins from the plugins object in the context,
  // then try and load from the config
  let pluginPath = 'plugins' in context ? getPluginPathFromPlugins(name, context) : getPluginPathFromConfig(name, context);

  // If we still haven't found the plugin, try and load from the default plugins
  if (!pluginPath) {
    pluginPath = defaultPlugins[name];
  }

  if (pluginPath) {
    try {
      const importedPlugin = await import(pluginPath);
      context.activePlugin = {
        config: importedPlugin.default,
        data: appStore.context.libraries[name],
        path: pluginPath,
        decorate: importedPlugin.decorate,
      };
      EventBus.instance.dispatchEvent(new CustomEvent(APP_EVENTS.PLUGIN_LOADED));
    } catch (error) {
      EventBus.instance.dispatchEvent(new CustomEvent(PLUGIN_EVENTS.TOAST, {
        detail: {
          variant: 'negative',
          message: appModel.appStore.localeDict.errorLoadingPlugin,
        },
      }));

      unloadPlugin(appModel);

      // eslint-disable-next-line no-console
      console.error(`Error loading plugin ${name}: ${error.message}`);
    }
    return;
  }

  EventBus.instance.dispatchEvent(new CustomEvent(PLUGIN_EVENTS.TOAST, {
    detail: {
      variant: 'negative',
      message: appModel.appStore.localeDict.unknownPlugin,
    },
  }));
}

/**
 * Unloads a plugin from the application
 * @param {AppModel} appModel The app model
 */
export async function unloadPlugin(appModel) {
  const { appStore } = appModel;
  appStore.context.activePlugin = undefined;
  EventBus.instance.dispatchEvent(new CustomEvent(APP_EVENTS.PLUGIN_UNLOADED));
}
