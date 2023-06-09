# Franklin Sidekick Library
[![codecov](https://img.shields.io/codecov/c/github/adobe/franklin-sidekick-library.svg)](https://codecov.io/gh/adobe/franklin-sidekick-library)
[![GitHub license](https://img.shields.io/github/license/adobe/franklin-sidekick-library.svg)](https://github.com/adobe/franklin-sidekick-library/blob/master/LICENSE.txt)
[![GitHub issues](https://img.shields.io/github/issues/adobe/franklin-sidekick-library.svg)](https://github.com/adobe/franklin-sidekick-library/issues)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

This repository contains the Library plugin for the [Franklin Sidekick](https://github.com/adobe/helix-sidekick-extension).

[DEMO](https://main--boilerplate-with-library--dylandepass.hlx.live/tools/sidekick/library.html)

## What is the Sidekick Library?

The Sidekick Library is an extension for the Franklin Sidekick that enables developers to create UI-driven tooling for franklin content authors. It includes a built-in blocks plugin that can display a list of all blocks to authors in an intuitive manner, removing the need for authors to remember or search for every variation of a block. Developers can also write their own plugins for the sidekick library.

## How to use the Sidekick Library?

The steps below detail how to setup the sidekick library and configure the blocks plugin.

## Library Sheet Setup

The sidekick library is populated with your plugins and plugin content using a sheet. 

1. Start by creating a directory in sharepoint or gdrive where you want to store the content for the library. We recommmending storing the content in `/tools/sidekick` (or any other name) in the root of the mountpoint. The next steps will assume the directory is called `/tools/sidekick`.
2. Next create a workbook (an Excel file) in the `/tools/sidekick` directory called `library` (or any other name). Each sheet in the workbook represents a plugin that will be loaded by the Sidekick Library. The name of the sheet determines the name of the plugin that will be loaded. Any data contained in the sheet will be passed to the plugin when loaded. The plugin sheet name must be prepended with `helix-`. For example, if you want to load a plugin called `tags`, you would create a sheet named `helix-tags`.
3. For this tutorial we will create a sheet for our `blocks` plugin. Create a sheet (or rename the default sheet) and call it `helix-blocks` and leave it empty for now.
3. The `library` workbook will be loaded by the Sidekick Library from the `hlx.live` origin which means the `access-control-allow-origin` header must be returned with the workbook. You will also need to return this header on any other content loaded by the sidekick library. So it's best to set this header on the `/tools/sidekick` directory and any of it's child directories. See [Custom Reponse Headers](https://www.hlx.live/docs/custom-headers) for more info how to set this up.

### Example `.helix/headers.xlsx`
![headers.xlsx](https://main--boilerplate-with-library--dylandepass.hlx.page/media_1d2afbd105a93fba6227559ed27b9308c5f973a51.png?width=2000&format=webply&optimize=medium)

## Blocks Plugin

The Sidekick library comes with a `blocks` plugin.

https://github.com/adobe/franklin-sidekick-library/assets/3231084/648b36b9-c74e-4b6e-9c6f-5ef937f84234

### Blocks Plugin Setup

To generate content for the blocks plugin, you need to prepare a separate Word document for each block you want to include.

1. Create a directory inside the `/tools/sidekick` directory where you will store all the block variations. For example, you could create a directory called `blocks` inside `/tools/sidekick`.
2. For this example, let's assume we want to define all the variations of a block called `columns`. First create a Word document called `columns` inside the `blocks` directory and provide examples of all the variations of the `columns` block. After each variation of the block add in a [section delimiter](https://www.hlx.live/docs/authoring#sections). ([Example](https://main--helix-test-content-onedrive--adobe.hlx.page/block-library-tests/blocks/columns/columns?view-doc-source=true)).
3. Preview and publish the `columns` document.
4. Open the library workbook created in the last section, inside the `helix-blocks` sheet, create two columns named `name` and `path`.
6. Next we need to add a row for our `columns` block. Add the name of the block in the first column and the url to the document that defines the block variations in the second column. For instance, if you want to add the `columns` block, you could create a row with the name `Columns` and the path `/tools/sidekick/blocks/columns`. In order for the library to work across enviroments (page, live, prod) you should not use an absolute url for the path column.
7. Preview and publish the `library` workbook.

### Example `library.xlsx`

![Library.xlsx](https://github.com/adobe/franklin-sidekick-library/assets/3231084/5f645ab8-cc30-4cd6-932b-94024d01713b)

#### (Optional) Authoring block names and descriptions.

By default the block name (with variation) will be used to render the item in the blocks plugin. For example, if the name of the block is `columns (center, background)` than that name will be used as the label when it’s rendered in the blocks plugin. This can be customized by creating a library metadata section within the same section as the block. Library metadata can also be used to author a description of the block as well as adding `searchTags` to include an alias for the block when using the search feature.

Example block with custom name and description

**Content**

![Screenshot 2023-06-08 at 1 11 09 PM](https://github.com/adobe/franklin-sidekick-library/assets/3231084/4c1d08ae-9f0d-4644-a55a-ac457e0132d2)

**Display**

![Screenshot 2023-06-08 at 1 13 32 PM](https://github.com/adobe/franklin-sidekick-library/assets/3231084/fce6f59c-775c-457c-bab5-8b3c85c0efa6)

## Sidekick plugin setup

Since the sidekick library is hosted on the same origin as the content, a static HTML page needs to be created to load and configure the content.

1. Create a file called `library.html` in `tools/sidekick/`;

2. Paste the following code in `library.html`.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, viewport-fit=cover"
    />
    <meta name="Description" content="Franklin Sidekick Library" />
    <meta name="robots" content="noindex" />
    <base href="/" />

    <style>
      html,
      body {
        margin: 0;
        padding: 0;
        font-family: sans-serif;
        background-color: #ededed;
        height: 100%;
      }
      
      helix-sidekick { display: none }
    </style>
    <title>Sidekick Library</title>
  </head>

  <body>
    <script
      type="module"
      src="https://www.hlx.live/tools/sidekick/library/index.js"
    ></script>
    <script>
      const library = document.createElement('sidekick-library')
      library.config = {
        base: '/tools/sidekick/library.json',
      }

      document.body.prepend(library)
    </script>
  </body>
</html>
```

In the code above we load the sidekick library from `hlx.live` and then create a custom `sidekick-library` element and add it to the page. The `sidekick-library` element accepts a `config` object that is required to configure the sidekick library.

### Supported configuration parameters
| Parameter Name | Value                                     | Description                                                                                                                     | Required |
|----------------|-------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------|----------|
| base           | Path to the library               | The base library to be loaded                                                                                                   | true     |
| extended       | Absolute URL to the extended library      | A library to extend the base library with                                                                                       | false    |
| {plugin-name}  | Path to the custom plugin js file | For custom plugins, the parameter name should be the name of the plugin and the value should be a URL to the plugin source (js) | false    |

If you have custom plugins for the sidekick library they can be added by including the plugin name in the config and then the path to the plugin. Ideally the plugin code is host same origin as the `library.html` document.

### Custom plugin setup

The example below of defines a tags plugin in the config.

```javascript
const library = document.createElement('sidekick-library')
library.config = {
  base: '/tools/sidekick/library.json',
  tags: '/tools/sidekick/plugins/tags/tags.js',
}
```

### Extended Libraries

In some cases merging two block libraries may be desirable. When an extended library is defined the sidekick library application will merge the base library and the extended library together into a single library list for authors. 

The example below defines a base library and an extended library (on another origin) that will be merged into the base library.


```javascript
const library = document.createElement('sidekick-library')
library.config = {
  base: '/tools/sidekick/library.json',
  extends: 'https://main--repo--owner.hlx.live/tools/sidekick/library.json'
}
```

> The `Access-Control-Allow-Origin` headers will need to be set on the `library.json` and blocks of the extended library in order for them to load in the sidekick library. See [Custom HTTP Response Headers](https://www.hlx.live/docs/custom-headers) for more info.

> Due to same-origin policies enforced by browsers on iframes a preview of an extended block cannot be loaded at this time. 

### Sidekick `config.json` setup

Next, in order for the sidekick library to appear in the sidekick a config file needs to be created at `tools/sidekick/config.json`. This config file needs to be created in the code bus and should be checked into github.

```json
{
  "project": "Example",
  "plugins": [
    {
      "id": "library",
      "title": "Library",
      "environments": ["edit"],
      "url": "/tools/sidekick/library.html",
      "includePaths": ["**.docx**"]
    }
  ]
}
```

The `url` property in the plugin configuration indicates the location from which the sidekick should load the plugin. This should point to the `library.html` file we previously created.

> The sidekick config must be checked into the `main` branch in order to for the plugin to appear in the sidekick.

> If the `tools/sidekick/config.json` file does not exist in your github repository, it must be created. For more information on sidekick plugin configuration options, see the [docs](https://github.com/adobe/helix-sidekick-extension/blob/main/docs/API.md#Plugin).

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

The following components from Spectrum are available

| Component              | Documentation Link                                                                           |
|------------------------|----------------------------------------------------------------------------------------------|
| sp-tooltip             | [Docs](https://opensource.adobe.com/spectrum-web-components/components/tooltip/)             |
| sp-toast               | [Docs](https://opensource.adobe.com/spectrum-web-components/components/toast/)               |
| sp-textfield           | [Docs](https://opensource.adobe.com/spectrum-web-components/components/textfield/)           |
| sp-sidenav-item        | [Docs](https://opensource.adobe.com/spectrum-web-components/components/sidenav-item/)        |
| sp-sidenav             | [Docs](https://opensource.adobe.com/spectrum-web-components/components/sidenav/)             |
| sp-search              | [Docs](https://opensource.adobe.com/spectrum-web-components/components/search/)              |
| sp-progress-circle     | [Docs](https://opensource.adobe.com/spectrum-web-components/components/progress-circle/)     |
| sp-picker              | [Docs](https://opensource.adobe.com/spectrum-web-components/components/picker/)              |
| sp-menu-item           | [Docs](https://opensource.adobe.com/spectrum-web-components/components/menu/)                |
| sp-menu-group          | [Docs](https://opensource.adobe.com/spectrum-web-components/components/menu/)                |
| sp-menu-divider        | [Docs](https://opensource.adobe.com/spectrum-web-components/components/menu/)                |
| sp-menu                | [Docs](https://opensource.adobe.com/spectrum-web-components/components/menu/)                |
| sp-illustrated-message | [Docs](https://opensource.adobe.com/spectrum-web-components/components/illustrated-message/) |
| sp-divider             | [Docs](https://opensource.adobe.com/spectrum-web-components/components/divider/)             |
| sp-card                | [Docs](https://opensource.adobe.com/spectrum-web-components/components/card/)                |
| sp-button-group        | [Docs](https://opensource.adobe.com/spectrum-web-components/components/button-group/)        |
| sp-button              | [Docs](https://opensource.adobe.com/spectrum-web-components/components/button/)              |
| sp-action-button       | [Docs](https://opensource.adobe.com/spectrum-web-components/components/action-button/)       |
| overlay-trigger        | [Docs](https://opensource.adobe.com/spectrum-web-components/components/overlay-trigger/)     |

The following icons from Spectrum are also available

| Component              | Documentation Link                                                                           |
|------------------------|----------------------------------------------------------------------------------------------|
| sp-icon-search         | [Docs](https://opensource.adobe.com/spectrum-web-components/components/icons-workflow/)      |
| sp-icon-file-template  | [Docs](https://opensource.adobe.com/spectrum-web-components/components/icons-workflow/)      |
| sp-icon-file-code      | [Docs](https://opensource.adobe.com/spectrum-web-components/components/icons-workflow/)      |
| sp-icon-device-phone   | [Docs](https://opensource.adobe.com/spectrum-web-components/components/icons-workflow/)      |
| sp-icon-device-tablet  | [Docs](https://opensource.adobe.com/spectrum-web-components/components/icons-workflow/)      |
| sp-icon-device-desktop | [Docs](https://opensource.adobe.com/spectrum-web-components/components/icons-workflow/)      |
| sp-icon-magic-wand     | [Docs](https://opensource.adobe.com/spectrum-web-components/components/icons-workflow/)      |
| sp-icon-copy           | [Docs](https://opensource.adobe.com/spectrum-web-components/components/icons-workflow/)      |
| sp-icon-preview        | [Docs](https://opensource.adobe.com/spectrum-web-components/components/icons-workflow/)      |
| sp-icon-info           | [Docs](https://opensource.adobe.com/spectrum-web-components/components/icons-workflow/)      |
| sp-icon-view-detail    | [Docs](https://opensource.adobe.com/spectrum-web-components/components/icons-workflow/)      |
| sp-icon-chevron-right  | [Docs](https://opensource.adobe.com/spectrum-web-components/components/icons-workflow/)      |
| sp-icon-chevron-left   | [Docs](https://opensource.adobe.com/spectrum-web-components/components/icons-workflow/)      |

### Plugin Events

Plugin authors can dispatch events from their plugin to the parent sidekick library in order to display a loader or to show a toast message.

#### Toast Messages

```js
import { PLUGIN_EVENTS } from 'https://hlx.live/tools/sidekick/library/events/events.js';

export async function decorate(container, data, query) {
  // Show a toast message
  container.dispatchEvent(new CustomEvent(PLUGIN_EVENTS.TOAST,  { detail: { message: 'Toast Shown!', variant: 'positive | negative' } }))
}
```

#### Show and Hide Loader

```js
import { PLUGIN_EVENTS } from 'https://hlx.live/tools/sidekick/library/events/events.js';

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

