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

import fetchMock from 'fetch-mock/esm/client';

const enLocalesUrl = '/src/locales/en/messages.json';
export const mockFetchEnLocalesSuccess = () => fetchMock.get(enLocalesUrl, {
  status: 200,
  body: {
    appTitle: {
      message: 'AEM Sidekick Library',
    },
    unknownPlugin: {
      message: 'Unknown plugin',
    },
    invalidConfiguration: {
      message: 'Invalid Configuration',
    },
    invalidConfigurationDescription: {
      message: 'The library is misconfigured',
    },
    errorLoadingPlugin: {
      message: 'Error loading plugin',
    },
    errorLoadingLibraryJSON: {
      message: 'Error loading library JSON',
    },
    generativeTextPrompt: {
      message: 'What would you like to say?',
    },
    generativeTextCTA: {
      message: 'Generate',
    },
    search: {
      message: 'Search',
    },
  },

});
