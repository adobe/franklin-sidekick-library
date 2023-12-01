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

import sinon from 'sinon';
import { expect } from '@open-wc/testing';
import {
  loadPlugin, unloadPlugin, getPluginPathFromPlugins, getPluginPathFromConfig,
} from '../../src/utils/plugin.js';
import { APP_EVENTS } from '../../src/events/events.js';
import { EventBus } from '../../src/events/eventbus.js';

describe('Plugin Util Tests', () => {
  let appModel;

  beforeEach(() => {
    window.libraryDev = true;
    appModel = {
      appStore: {
        context: {
          baseLibraryOrigin: 'https://main--helix-test-content-onedrive--adobe.hlx.page',
          libraries: {
            blocks: {},
          },
        },
        localeDict: {
          errorLoadingPlugin: 'Error loading plugin',
        },
      },
    };
  });
  afterEach(() => {
    window.libraryDev = false;
  });
  describe('loadPlugin', () => {
    it('should load the plugin and update appStore correctly', async () => {
      const eventSpy = sinon.spy();
      const importedPlugin = { default: { title: 'Blocks' } };
      EventBus.instance.addEventListener(APP_EVENTS.PLUGIN_LOADED, eventSpy);
      await loadPlugin(appModel, 'blocks');
      expect(appModel.appStore.context.activePlugin.data)
        .to.equal(appModel.appStore.context.libraries.blocks);
      expect(appModel.appStore.context.activePlugin.config.title)
        .to.equal(importedPlugin.default.title);
      expect(eventSpy.calledOnce).equals(true);
    });
  });

  describe('unloadPlugin', () => {
    it('should unload the plugin and update appStore correctly', () => {
      const eventSpy = sinon.spy();
      EventBus.instance.addEventListener(APP_EVENTS.PLUGIN_UNLOADED, eventSpy);
      unloadPlugin(appModel);
      expect(appModel.appStore.context.activePlugin).equals(undefined);
      expect(eventSpy.calledOnce).equals(true);
    });
  });

  describe('getPluginPathFromPlugins', () => {
    it('should return undefined if the plugin does not exist', () => {
      const context = { plugins: {} };
      const result = getPluginPathFromPlugins('nonExistentPlugin', context);
      expect(result).to.be.undefined;
    });

    it('should return undefined if the plugin has no src property', () => {
      const context = { plugins: { testPlugin: {} } };
      const result = getPluginPathFromPlugins('testPlugin', context);
      expect(result).to.be.undefined;
    });

    it('should return src as is if it is not a path', () => {
      const context = { plugins: { testPlugin: { src: 'http://example.com/plugin' } } };
      const result = getPluginPathFromPlugins('testPlugin', context);
      expect(result).to.equal('http://example.com/plugin');
    });

    it('should prepend baseLibraryOrigin to src if it is a path', () => {
      const context = { baseLibraryOrigin: 'http://localhost', plugins: { testPlugin: { src: '/plugin' } } };
      const result = getPluginPathFromPlugins('testPlugin', context);
      expect(result).to.equal('http://localhost/plugin');
    });
  });

  describe('getPluginPathFromConfig', () => {
    it('should return undefined if the plugin is not in the context', () => {
      const context = {};
      const result = getPluginPathFromConfig('nonExistentPlugin', context);
      expect(result).to.be.undefined;
    });

    it('should return configPlugin as is if it is not a path', () => {
      const context = { testPlugin: 'http://example.com/plugin' };
      const result = getPluginPathFromConfig('testPlugin', context);
      expect(result).to.equal('http://example.com/plugin');
    });

    it('should prepend baseLibraryOrigin to configPlugin if it is a path', () => {
      const context = { baseLibraryOrigin: 'http://localhost', testPlugin: '/plugin' };
      const result = getPluginPathFromConfig('testPlugin', context);
      expect(result).to.equal('http://localhost/plugin');
    });
  });
});
