# Franklin Sidekick Library
[![codecov](https://img.shields.io/codecov/c/github/dylandepass/franklin-sidekick-library.svg)](https://codecov.io/gh/dylandepass/franklin-sidekick-library)
[![GitHub license](https://img.shields.io/github/license/dylandepass/franklin-sidekick-library.svg)](https://github.com/dylandepass/franklin-sidekick-library/blob/master/LICENSE.txt)
[![GitHub issues](https://img.shields.io/github/issues/dylandepass/franklin-sidekick-library.svg)](https://github.com/dylandepass/franklin-sidekick-library/issues)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

This repository contains the Library plugin for the [Franklin Sidekick](https://github.com/adobe/helix-sidekick-extension).

[DEMO](https://main--boilerplate-with-library--dylandepass.hlx.page/sidekick/library?suppressFrame=true)

## What is the Sidekick Library?

The Sidekick Library is a plugin for the Franklin Sidekick that allows developers to build UI based tooling for their franklin content authoring enviroment (office, gdocs). It comes standard with a blocks plugin that can display a list of all blocks to authors in an intuitive manner, removing the need for authors to remember or search for every variation of a block. Developers can also write their own plugins for the library or even write their own blocks plugin.

## How to use the Sidekick Library?

The sidekick library is an application hosted on `hlx.live` that customers can add to their sidekick config file at `tools/sidekick/config.json`. 

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

The `url` property of the plugin configuration is what tells the sidekick where to load the plugin from. In the example above we are telling the sidekick to load the library plugin from `hlx.live` and configuring it using URL parameters.

### Supported configuration parameters
| Parameter Name | Value                                     | Description                                                                                                                     | Required |
|----------------|-------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------|----------|
| base           | Absolute URL to the library               | The base library to be loaded                                                                                                   | true     |
| extended       | Absolute URL to the extended library      | A library to extend the base library with                                                                                       | false    |
| {plugin-name}  | Absolute URL to the custom plugin js file | For custom plugins, the parameter name should be the name of the plugin and the value should be a URL to the plugin source (js) | false    |

Below is an example URL that sets the base libray, an extended library and a custom plugin called `tags`.

`https://hlx.live/tools/sidekick/library?base=https://main--repo1--company.hlx.live/sidekick/library.json&extended=https://main--repo2--company.hlx.live/sidekick/library.json&tags=https://main--repo1--company.hlx.live/tools/sidekick/plugins/tags/tags.js`

> The sidekick config must be checked into the `main` branch in order to for the plugin to appear in the sidekick.

> If the `tools/sidekick/config.json` file does not exist in your github repository, it must be created. For more information on sidekick plugin configuration options, see the [docs](https://github.com/adobe/helix-sidekick-extension/blob/main/docs/API.md#Plugin).

## Library Sheet Setup

The sidekick library is populate with your plugins and content using a sheet. 

1. Start by creating a directory in sharepoint or gdrive where you want to store the content for the library. For example, create a directory called `sidekick` (or any other name) in the root of the mountpoint. The next steps will assume the directory is called `sidekick`.
2. Next create a workbook (an Excel file) in the `sidekick` directory called `library` (or any other name). Each sheet in the workbook represents a plugin that will be loaded by the Sidekick Library. The name of the sheet determines the name of the plugin that will be loaded. Any data contained in the sheet will be passed to the plugin when loaded. The plugin sheet name must be prepended with `helix-`. For example, if you want to load a plugin called `tags`, you would create a sheet named `helix-tags`.
3. Preview and publish the library workbook
4. Update the url in the sidekick plugin configuration at `tools/sidekick/config.json` to point to this sheet as the `base` library. For example, assuming your library is at `https://main--repo1--company.hlx.live/sidekick/library.json` you would set the `url` of the library plugin to `https://hlx.live/tools/sidekick/library?base=https://main--repo1--company.hlx.live/sidekick/library.json`
3. The `library` workbook will be loaded by the Sidekick Library from the `hlx.live` origin which means the `access-control-allow-origin` header must be returned with the workbook. You will also need to return this header on any other content loaded by the sidekick library. So it's best to set this header on the `sidekick` directory and any of it's child directories. See [Custom Reponse Headers](https://www.hlx.live/docs/custom-headers) for more info how to set this up.

### Example `header.xlsx`
![headers.xlsx](https://main--boilerplate-with-library--dylandepass.hlx.page/sidekick/blocks/columns/media_1c987fe9c77cf4cb9bb0bc85c76d280e135d2388f.png?width=2000&format=webply&optimize=medium)

## Blocks Plugin

The Sidekick library comes with a single `blocks` plugin.

![block-library](https://user-images.githubusercontent.com/3231084/233149458-f56d6b23-abca-4bea-9129-833d3418211f.gif)

### Blocks Plugin Setup

1. Create a directory inside the `sidekick` directory where you will store all the block variations. For example, you could create a directory called `blocks` inside `sidekick`.
2. Inside the `blocks` directory, create a Word document called `columns` and provide examples of all the variations of the `columns` block ([Example](https://main--helix-test-content-onedrive--adobe.hlx.page/block-library-tests/blocks/columns/columns?view-doc-source=true)).
3. Preview the `columns` document.
4. Within the library workbook, add a new sheet and name it `helix-blocks`.
5. Inside the helix-blocks sheet, create two columns named `name` and `path`.
6. To include a block set in the block library, add a new row to the `helix-blocks` sheet and specify the name of the block in the first column and the absolute path to the document that defines the block variations in the second column. For instance, if you want to add a columns block, you could create a row with the name `Columns` and the path `https://main--mysite--myowner.hlx.page/sidekick/blocks/columns`.
7. Preview and publish the `library` workbook again.

#### (Optional) Authoring block names and descriptions.

By default the block name and variation will be used to render the item in the blocks plugin. For example, if the name of the block is `columns (center, background)` than that name will be used as the label. This can be customized by preceeding the block with an `h2`, when this is done the value fo the `h2` will be used instead. 

If the block is preceeded with a paragraph, that text will be treated as a description of the  block and will appear in as a tooltip on the block item.

Example block with custom name and description

**Content**

![Authored name](https://main--helix-test-content-onedrive--adobe.hlx.page/block-library-tests/blocks/columns/media_1e460e31cfc2a6f198bae6bc772f4371bd228f493.png?width=2000&format=webply&optimize=medium)

**Display**

![Rendered result](https://main--helix-test-content-onedrive--adobe.hlx.page/block-library-tests/blocks/columns/media_1b69e1fdc3fb71b453a1ddf22560174deb3093185.png?width=2000&format=webply&optimize=medium)

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

The default export from a plugin allows authors have the ability to customize the plugin name displayed in the header upon loading, as well as activate the search functionality within the sidekick library.

```js
export default {
  title: 'Tags',
  searchEnabled: true,
};
```

When the `searchEnabled` property is true, the library header will display a search icon upon loading the plugin. If the user initiates a search by entering a query, the `decorate()` function of the plugin will be triggered again, this time with the search string passed in the query parameter of the `decorate()` function.

### Plugin web components

Plugin authors can utilize a select set of web components from [Spectrum](https://opensource.adobe.com/spectrum-web-components/index.html) when building a custom plugin.

The available components from Spectrum are

| Component              | Documentation Link                                                                           |
|------------------------|----------------------------------------------------------------------------------------------|
| sp-button              | [Docs](https://opensource.adobe.com/spectrum-web-components/components/button/)              |
| sp-button-group        | [Docs](https://opensource.adobe.com/spectrum-web-components/components/button-group/)        |
| sp-action-button       | [Docs](https://opensource.adobe.com/spectrum-web-components/components/action-button/)       |
| sp-sidenav             | [Docs](https://opensource.adobe.com/spectrum-web-components/components/sidenav/)             |
| sp-sidenav-item        | [Docs](https://opensource.adobe.com/spectrum-web-components/components/sidenav-item/)        |
| sp-menu                | [Docs](https://opensource.adobe.com/spectrum-web-components/components/menu/)                |
| sp-menu-item           | [Docs](https://opensource.adobe.com/spectrum-web-components/components/menu/)                |
| sp-menu-group          | [Docs](https://opensource.adobe.com/spectrum-web-components/components/menu/)                |
| sp-menu-divider        | [Docs](https://opensource.adobe.com/spectrum-web-components/components/menu/)                |
| sp-search              | [Docs](https://opensource.adobe.com/spectrum-web-components/components/search/)              |
| sp-illustrated-message | [Docs](https://opensource.adobe.com/spectrum-web-components/components/illustrated-message/) |
| sp-divider             | [Docs](https://opensource.adobe.com/spectrum-web-components/components/divider/)             |
| sp-tooltip             | [Docs](https://opensource.adobe.com/spectrum-web-components/components/tooltip/)             |
| overlay-trigger        | [Docs](https://opensource.adobe.com/spectrum-web-components/components/overlay-trigger/)     |

### Plugin Events

Plugin authors can dispatch events from their plugin to the parent sidekick library in order to display a loader or to show a toast message.

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
