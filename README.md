# Franklin Sidekick Library
[![codecov](https://img.shields.io/codecov/c/github/dylandepass/franklin-sidekick-library.svg)](https://codecov.io/gh/dylandepass/franklin-sidekick-library)
[![GitHub license](https://img.shields.io/github/license/dylandepass/franklin-sidekick-library.svg)](https://github.com/dylandepass/franklin-sidekick-library/blob/master/LICENSE.txt)
[![GitHub issues](https://img.shields.io/github/issues/dylandepass/franklin-sidekick-library.svg)](https://github.com/dylandepass/franklin-sidekick-library/issues)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

This repository contains the Library plugin for the [franklin sidekick](https://github.com/adobe/helix-sidekick-extension).

## What is the Sidekick Library?

The Sidekick Library is a tool that can aggregate different data into a single application to aid authors when writing content for Franklin. It comes with a blocks plugin that displays a list of all blocks and block variations to authors in an intuitive manner, removing the need for authors to remember or search for every variation of a block.

The Sidekick Library and the blocks plugin are hosted on `hlx.live` and maintained by the Franklin team. Customers are free to write their own plugins for the library or even write their own blocks plugin.

To integrate with the Sidekick Library, customers need to create a spreadsheet that will define the plugins used along with any data required by the plugin to render.

## How to use the Sidekick Library?

The sidekick library is an application hosted on `hlx.live` that customers can add to their sidekick config at `tools/sidekick/config.json`. If this file does not exist, it must be created.

```json
{
  "project": "Example",
  "plugins": [
    {
      "id": "library",
      "title": "Library",
      "environments": [ "edit" ],
      "isPalette": true,
      "paletteRect": "top: auto; bottom: 20px; left: 20px; height: 398px; width: 360px;",
      "url": "https://hlx.live/tools/sidekick/library?base={PATH_TO_LIBRARY_JSON}",
      "includePaths": [ "**.docx**" ]
    }
  ]
}
```

The library is configured via the url parameters:

| Parameter Name | Value                            | Description                                                                                                                     | Required |
|----------------|----------------------------------|---------------------------------------------------------------------------------------------------------------------------------|----------|
| base           | URL to the library               | The base library to be loaded                                                                                                   | true     |
| extended       | URL to the extended library      | A library to extend the base library with                                                                                       | false    |
| {plugin-name}  | URL to the custom plugin js file | For custom plugins, the parameter name should be the name of the plugin and the value should be a URL to the plugin source (js) | false    |

> The sidekick config must be checked into the `main` branch in order to for the plugin to appear in the sidekick.

### Library Sheet Setup

1. Create a directory in sharepoint or gdrive (under the mountpoint) where you want to store the content for the library. For example, create a directory called `sidekick` (or any other name) in the root of the mountpoint. For the next steps it will be assumed the directory is called `sidekick`.
2. In order to use the Sidekick Library, you need to create a workbook (an Excel file) in the sidekick directory called `library` (or any other name). Each sheet in the workbook represents a plugin that will be loaded by the Sidekick Library. The name of the sheet determines the name of the plugin that will be loaded. Any content contained in the sheet will be passed to the corresponding plugin. This allows you to customize the behavior of the Sidekick Library to suit your needs.
3. When you create a sheet in the `library` workbook, you should name it according to the plugin you want to load, with `helix-` prepended to the name. For example, if you want to load a plugin called `tags`, you would create a sheet named `helix-tags`.

Since this sheet will be loaded by the Sidekick Library from the `hlx.live` origin, the `access-control-allow-origin` header must be returned with the sheet. You will also need to return this header on any content loaded by the sidekick library. So it's best to set this header on the `sidekick` directory and any of it's child directories. See [Custom Reponse Headers](https://www.hlx.live/docs/custom-headers) for more info how to set this up.

### Block library setup

1. Create a directory inside the `sidekick` directory where you will store all the block variations. For example, you could create a directory called `blocks` inside `sidekick`.
2. Inside the `blocks` directory, create a Word document called `columns` and provide examples of all the variations of the `columns` block ([Example](https://main--helix-test-content-onedrive--adobe.hlx.page/block-library-tests/blocks/columns/columns?view-doc-source=true)).
3. Preview the `columns` document.
4. Within the library workbook, add a new sheet and name it helix-blocks.
5. Inside the helix-blocks sheet, create two columns named name and path.
6. To include a block set in the block library, add a new row to the helix-blocks sheet and specify the name of the block in the first column and the absolute path to the document that defines the block variations in the second column. For instance, if you want to add a columns block, you could create a row with the name "Columns" and the path "https://main--mysite--myowner.hlx.page/sidekick/blocks/columns".
7. Preview and publish the `library` workbook.

## Building a Plugin

Developing a plugin is similar to constructing a block in Franklin. Once a user tries to load the plugin, the sidekick library will trigger the `decorate()` method on your plugin. This method receives the container to render the plugin in and any data that included in the plugins sheet.

```js
/**
 * Called when a user tries to load the plugin
 * @param {HTMLElement} container The container to render the plugin in
 * @param {Object} data The data contained in the plugin sheet
 * @param {String} query If search is active, the current search query
 */
export async function decorate(container, data, query) {
  // Render your plugin
}
```

> The `decorate()` function must be exported from the plugin.

### Plugin default export & search

The default export from a plugin allows plugin authors to set the plugin name that appears in the header when the plugin is loaded and also to enable the search functionality that comes as part of the sidekick library.

```js
export default {
  title: 'Tags',
  searchEnabled: true,
};
```

If the `searchEnabled` property is set to true the search icon will appear in the library header when the plugin is loaded. If the users enters a search query this `decorate()` function of the plugin will be called again with the search string passed in the `query` parameter of the `decorate()` function.

### Plugin web components

Plugin authors can utilize a select set of web components from [Spectrum](https://opensource.adobe.com/spectrum-web-components/index.html) that is included by the sidekick library when developing their plugin.

The available components from Spectrum are

| Component              | Documentation Link                                                                           |
|------------------------|----------------------------------------------------------------------------------------------|
| sp-tooltip             | [Docs](https://opensource.adobe.com/spectrum-web-components/components/tooltip/)             |
| sp-sidenav-item        | [Docs](https://opensource.adobe.com/spectrum-web-components/components/sidenav-item/)        |
| sp-sidenav             | [Docs](https://opensource.adobe.com/spectrum-web-components/components/sidenav/)             |
| sp-search              | [Docs](https://opensource.adobe.com/spectrum-web-components/components/search/)              |
| sp-menu-item           | [Docs](https://opensource.adobe.com/spectrum-web-components/components/menu/)                |
| sp-menu-group          | [Docs](https://opensource.adobe.com/spectrum-web-components/components/menu/)                |
| sp-menu-divider        | [Docs](https://opensource.adobe.com/spectrum-web-components/components/menu/)                |
| sp-menu                | [Docs](https://opensource.adobe.com/spectrum-web-components/components/menu/)                |
| sp-illustrated-message | [Docs](https://opensource.adobe.com/spectrum-web-components/components/illustrated-message/) |
| sp-divider             | [Docs](https://opensource.adobe.com/spectrum-web-components/components/divider/)             |
| sp-divider             | [Docs](https://opensource.adobe.com/spectrum-web-components/components/divider/)             |
| sp-button-group        | [Docs](https://opensource.adobe.com/spectrum-web-components/components/button-group/)        |
| sp-button              | [Docs](https://opensource.adobe.com/spectrum-web-components/components/button/)              |
| sp-action-button       | [Docs](https://opensource.adobe.com/spectrum-web-components/components/action-button/)       |
| overlay-trigger        | [Docs](https://opensource.adobe.com/spectrum-web-components/components/overlay-trigger/)     |

### Plugin Events

Plugin authors can dispatch events from their plugin to the sidekick library in order to display a loader or to show a toast message.

#### Toast Messages

```js
import { PLUGIN_EVENTS } from 'https://hlx.live/tools/sidekick/library/index.js';

export async function decorate(container, data, query) {
  // Show a toast message
  container.dispatchEvent(new CustomEvent(PLUGIN_EVENTS.TOAST,  { detail: { message: 'Toast Shown!', variant: 'positive | negative' } }))
}
```

#### Show and Hide Loader

```js
import { PLUGIN_EVENTS } from 'https://hlx.live/tools/sidekick/library/index.js';

export async function decorate(container, data, query) {
  // Show loader
  container.dispatchEvent(new CustomEvent(PLUGIN_EVENTS.SHOW_LOADER))
  ...
  // Hide loader
  container.dispatchEvent(new CustomEvent(PLUGIN_EVENTS.HIDE_LOADER))
}
```

### Example plugin

[Tags Plugin](https://github.com/dylandepass/boilerplate-with-library/blob/main/tools/sidekick/plugins/tags/tags.js)
[Plugin API Example](https://github.com/dylandepass/boilerplate-with-library/blob/main/tools/sidekick/plugins/api-test/api-test.js)

## Demo
[Franklin Library](https://main--franklin-sidekick-library-host--dylandepass.hlx.live/tools/sidekick/library?base=https://main--helix-test-content-onedrive--adobe.hlx.page/block-library-tests/library-multi-sheet.json)

## Development

### Install Dependencies

```bash
$ npm install
```

### Start Development Server

```bash
$ npm run start
```

### Run Tests

```bash
$ npm test
```

### Lint

```bash
$ npm run lint
```

### Build

```bash
$ npm run build
```