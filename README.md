# AEM Sidekick Library
[![codecov](https://img.shields.io/codecov/c/github/adobe/franklin-sidekick-library.svg)](https://codecov.io/gh/adobe/franklin-sidekick-library)
[![GitHub license](https://img.shields.io/github/license/adobe/franklin-sidekick-library.svg)](https://github.com/adobe/franklin-sidekick-library/blob/master/LICENSE.txt)
[![GitHub issues](https://img.shields.io/github/issues/adobe/franklin-sidekick-library.svg)](https://github.com/adobe/franklin-sidekick-library/issues)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

This repository contains the Library plugin for the [Franklin Sidekick](https://github.com/adobe/helix-sidekick-extension).

[DEMO](https://main--boilerplate-with-library--dylandepass.hlx.live/tools/sidekick/library.html)

## What is the Sidekick Library?

The Sidekick Library is an extension for the AEM Sidekick that enables developers to create UI-driven tooling for content authors. It includes a built-in blocks plugin that can display a list of all blocks to authors in an intuitive manner, removing the need for authors to remember or search for every variation of a block. Developers can also write their own plugins for the sidekick library.

## How to use the Sidekick Library?

The steps below detail how to setup the sidekick library and configure the blocks plugin.

## Library Sheet Setup

The sidekick library is populated with your plugins and plugin content using a sheet. 

1. Start by creating a directory in sharepoint or gdrive where you want to store the content for the library. We recommmending storing the content in `/tools/sidekick` (or any other name) in the root of the mountpoint. The next steps will assume the directory is called `/tools/sidekick`.
2. Next create a workbook (an Excel file) in the `/tools/sidekick` directory called `library` (or any other name). Each sheet in the workbook represents a plugin that will be loaded by the Sidekick Library. The name of the sheet determines the name of the plugin that will be loaded. Any data contained in the sheet will be passed to the plugin when loaded. The plugin sheet name must be prepended with `helix-`. For example, if you want to load a plugin called `tags`, you would create a sheet named `helix-tags`.
3. For this tutorial we will create a sheet for our `blocks` plugin. Create a sheet (or rename the default sheet) and call it `helix-blocks` and leave it empty for now.

## Blocks Plugin

The Sidekick library comes with a `blocks` plugin.

https://github.com/adobe/franklin-sidekick-library/assets/3231084/648b36b9-c74e-4b6e-9c6f-5ef937f84234

### Blocks Plugin Setup

To generate content for the blocks plugin, you need to prepare a separate Word document for each block you want to include.

1. Create a directory inside the `/tools/sidekick` directory where you will store all the block variations. For example, you could create a directory called `blocks` inside `/tools/sidekick`.
2. For this example, let's assume we want to define all the variations of a block called `columns`. First create a Word document called `columns` inside the `blocks` directory and provide examples of all the variations of the `columns` block. After each variation of the block add in a [section delimiter](https://www.aem.live/docs/authoring#sections). ([Example](https://main--helix-test-content-onedrive--adobe.hlx.page/block-library-tests/blocks/columns/columns?view-doc-source=true)).
3. Preview and publish the `columns` document.
4. Open the library workbook created in the last section, inside the `helix-blocks` sheet, create two columns named `name` and `path`.
6. Next we need to add a row for our `columns` block. Add the name of the block in the first column and the url to the document that defines the block variations in the second column. For instance, if you want to add the `columns` block, you could create a row with the name `Columns` and the path `/tools/sidekick/blocks/columns`. In order for the library to work across enviroments (page, live, prod) you should not use an absolute url for the path column.
7. Preview and publish the `library` workbook.

> Since the example blocks are being published you should use [bulk metadata](https://www.aem.live/docs/bulk-metadata) to exclude the content inside of `/tools/**` from being indexed.
> 
> ![Screenshot 2024-04-09 at 2 54 19 PM](https://github.com/adobe/franklin-sidekick-library/assets/3231084/90781787-6837-46ea-9d5f-d49f336c4925)


### Example `library.xlsx`

![Library.xlsx](https://github.com/adobe/franklin-sidekick-library/assets/3231084/5f645ab8-cc30-4cd6-932b-94024d01713b)

## Library Metadata
The blocks plugins supports a special type of block called `library metadata` which provides a way for developers to tell the blocks plugin some information about the block or how it should be rendered.

### Supported library metadata options
| Key Name              | Value                                          | Description                                                                                                                                                       | Required |
|-----------------------|------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|
| name                  | Name of the block                              | Allows you to set a custom name for the block                                                                                                                     | false    |
| description           | A description of the block                     | Allows you to set a custom description for a block                                                                                                                | false    |
| type                  | The type of the block                          | This tells the blocks plugin how to group the content that makes up your block. Possible options are `template` or `section` (details below)                      | false    |
| include next sections | How many sections to include in the block item | Use if your block requires content from subsequence sections in order to render. Should be a number value that indicates how much subsequent sections to include. | false    |
| searchtags            | A comma seperated list of search terms         | Allows you to define other terms that could be used when searching for this block in the blocks plugin                                                            | false    |
| tableHeaderBackgroundColor            | A hex color (ex #ff3300)         | Overrides the table header background color for any blocks in the section or page.                                                            | false    |
| tableHeaderForegroundColor            | A hex color (ex #ffffff)         | Overrides the table header foreground color for any blocks in the section or page.                                                            | false    |
| contentEditable            | A boolean value (default: true)         | Set to false to disable content editing in the preview window.                                                            | false    |
| disableCopy            | A boolean value (default: false)         | Set to true to disable the copy button in the preview window.                                                            | false    |
| hideDetailsView            | A boolean value (default: false)         | Hide the block details panel inside the preview window.                                                            | false    |

### Default Library metadata vs Library metadata

There are two types of `library metadata`. Library metadata that lives within a section containing the block, or _default_ `library metadata` that applies to the document as a whole and lives in a section on it's own (a block called `library metadata` as the only child in a section).

Let's take an example of a hero block that has 5 variants. Suppose you want to add the same description for each variation of the block, rather than duplicating the `library metadata` with the description into each section containing the variations. You could instead use _default_ `library metadata` to apply the same description to every variation of the block. If you decide that one variation actually needs a slightly different description you could add `library metadata` to the section containing the variation and it would override the _default_ `library metadata` description when it's rendered within the blocks plugin.

### Authoring block names and descriptions using Library Metadata

By default the block name (with variation) will be used to render the item in the blocks plugin. For example, if the name of the block is `columns (center, background)` than that name will be used as the label when it’s rendered in the blocks plugin. This can be customized by creating a `library metadata` section within the same section as the block. Library metadata can also be used to author a description of the block as well as adding `searchTags` to include an alias for the block when using the search feature.

Example block with custom name and description

**Content**

![Screenshot 2023-06-08 at 1 11 09 PM](https://github.com/adobe/franklin-sidekick-library/assets/3231084/4c1d08ae-9f0d-4644-a55a-ac457e0132d2)

**Display**

![Screenshot 2023-06-08 at 1 13 32 PM](https://github.com/adobe/franklin-sidekick-library/assets/3231084/fce6f59c-775c-457c-bab5-8b3c85c0efa6)

### Autoblocks and Default Content

The blocks plugin is capable of rendering [default content](https://www.aem.live/developer/markup-sections-blocks#default-content) and [autoblocks](https://www.aem.live/developer/markup-sections-blocks#auto-blocking). In order to achieve this, it is necessary to place your `default content` or `autoblock` within a dedicated section, which should include a `library metadata` table defining a `name` property, as previously described. If no name is specified in the library metadata, the item will be labeled as "Unnamed Item."

### Blocks composed of content in subsequent sections

There are situations where developers may want a block to consist of content from subsequent sections. This pattern is discouraged for reasons stated [here](https://www.aem.live/docs/davidsmodel#rule-3-limit-row-and-column-spans), but if you choose to use it the blocks plugin can render these items using the `include next sections` property in `library metadata`.

![Screenshot 2023-09-07 at 2 42 13 PM](https://github.com/adobe/franklin-sidekick-library/assets/3231084/32442f30-5147-4997-9048-cef9180c4ec2)

### Templates

Templates are a way to group an entire document into a single element in the sidekick library. To mark a document as a template set `type` to `template` in `default library metadata`.

> Important, the `library metadata` needs to be in it's own section and be the only child to be considered `default library metadata`.

Supporting `metadata` is also desirable for templates. To add a metadata table to the template you can use a `Page metadata` block.

![266064147-12883ee0-147b-4171-b89a-c313e33eef24](https://github.com/adobe/franklin-sidekick-library/assets/3231084/d4b6f9af-0829-4c73-815f-0cac036ce942)

When the template is copied a `metadata` with the values will be added along with the content to the clipboard.

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
    <meta name="Description" content="AEM Sidekick Library" />
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
      src="https://www.aem.live/tools/sidekick/library/index.js"
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

In the code above we load the sidekick library from `aem.live` and then create a custom `sidekick-library` element and add it to the page. The `sidekick-library` element accepts a `config` object that is required to configure the sidekick library.

### Supported configuration parameters
| Parameter Name | Value                                     | Description                                                                                                                     | Required |
|----------------|-------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------|----------|
| base           | Path to the library               | The base library to be loaded                                                                                                   | true     |
| extends       | Absolute URL to the extended library      | A library to extend the base library with 
| plugins  | An object containing plugins to register with the sidekick library. | The plugins object can be used to register plugins and configure data that should be passed to the plugin | false    |

The blocks plugin supports the following configuration properties that can be set using the `plugins` object.

### Blocks plugin configuration parameters
| Parameter Name | Value                                     | Description                                                                                                                     | Required |
|----------------|-------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------|----------|
| encodeImages    | A boolean value that indicates if images should be encoded during copy operations               | If your site has a Zero trust network access (ZTNA) service enabled such as Cloudflare Access then images should be encoded for copy/paste operations to work correctly with images. | false     |
| viewPorts      | Full or simplified configuration object, see examples below.                                    | Configuration to overwrite the default viewport sizes. The default is 480px fo mobile, 768px for tablet and 100% of the current window for desktop.                                  | false     |
| contentEditable      | A boolean value to disable content editing in all block previews.                                    | Set to false to disable content editing.                                  | false     |

#### Examples

```javascript
const library = document.createElement('sidekick-library')
library.config = {
  base: '/tools/sidekick/library.json',
  plugins: {
    blocks: {
      encodeImages: true,
    }
  }
}
```

```javascript
const library = document.createElement('sidekick-library')
library.config = {
  base: '/tools/sidekick/library.json',
  plugins: {
    blocks: {
      viewPorts: [600, 900],
    }
  }
}
```

```javascript
const library = document.createElement('sidekick-library')
library.config = {
  base: '/tools/sidekick/library.json',
  plugins: {
    blocks: {
      viewPorts: [
        {
          width: '599px',
          label: 'Small',
          icon: 'device-phone',
        },
        {
          width: '899px',
          label: 'Medium',
          icon: 'device-tablet',
        },
        {
          width: '100%',
          label: 'Large',
          icon: 'device-desktop',
          default: true,
        },
      ],
    }
  }
}
```

### Custom table header colors
You can customize the table header background and foreground color when pasting a block, section metadata or metadata that was copied from the blocks plugin.

Default styles can be set in `library.html` using css variables.

```html
  <style>
    :root {
      --sk-block-table-background-color: #03A;
      --sk-block-table-foreground-color: #fff;

      --sk-section-metadata-table-background-color: #f30;
      --sk-section-metadata-table-foreground-color: #000;

      --sk-metadata-table-background-color: #000;
      --sk-metadata-table-foreground-color: #fff;
    }
  </style>
``` 

These values can be overridden using [library metadata](#supported-library-metadata-options).

> Depending on the system color scheme selected for the users computer (dark mode), Word may alter the chosen colors in an attempt to improve accessibility.

### Custom plugin setup

The example below defines a tags plugin in the config. The keys of the plugins object must match the name of the plugin, any other properties defined in the plugin object will be available to the plugin via the context argument of the [decorate](#building-a-plugin) method.

```javascript
const library = document.createElement('sidekick-library')
library.config = {
  base: '/tools/sidekick/library.json',
  plugins: {
    tags: {
      src: '/tools/sidekick/plugins/tags/tags.js',
      foo: 'bar'
    }
  }
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

> The `Access-Control-Allow-Origin` headers will need to be set on the `library.json` and blocks of the extended library in order for them to load in the sidekick library. See [Custom HTTP Response Headers](https://www.aem.live/docs/custom-headers) for more info.

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
      "excludePaths": ["**"],
      "includePaths": ["**.docx**", "/document/**"]
    }
  ]
}
```

The `url` property in the plugin configuration indicates the location from which the sidekick should load the plugin. This should point to the `library.html` file we previously created.

> The sidekick config must be checked into the `main` branch in order to for the plugin to appear in the sidekick.

> If the `tools/sidekick/config.json` file does not exist in your github repository, it must be created. For more information on sidekick plugin configuration options, see the [docs](https://github.com/adobe/helix-sidekick-extension/blob/main/docs/API.md#Plugin).

## Considerations when building blocks for the library

The sidekick library renders blocks by first fetching the `plain.html` rendition of the the block and then strips it of any other blocks in the content (for example if there are multiple variations of a block in the response). It then requests the same page (without `.plain.html`) and replaces the `main` element with the stripped block and loads the entire document into an `iframe` using the [srcdoc](https://developer.mozilla.org/en-US/docs/Web/API/HTMLIFrameElement/srcdoc) attribute.

### Use of `window.location`
Since the block is loaded in an iframe using the `srcdoc` attribute, the instance of the `window.location` object used by your sites code will not contain the typical values you would expect to see.

Example `window.location` object when running in the library
```json
{
  "host": "",
  "hostname": "",
  "href": "about:srcdoc"
  "origin": "null"
  "pathname": "srcdoc"
  "port": ""
  "protocol": "about:"
}
```

For this reason, if your block requires use of the `window.location` object we recommend adding the following functions to your `scripts.js` file and importing them into your function for use.

```js
/**
 * Returns the true origin of the current page in the browser.
 * If the page is running in a iframe with srcdoc, the ancestor origin is returned.
 * @returns {String} The true origin
 */
export function getOrigin() {
  const { location } = window;
  return location.href === 'about:srcdoc' ? window.parent.location.origin : location.origin;
}

/**
 * Returns the true of the current page in the browser.mac
 * If the page is running in a iframe with srcdoc,
 * the ancestor origin + the path query param is returned.
 * @returns {String} The href of the current page or the href of the block running in the library
 */
export function getHref() {
  if (window.location.href !== 'about:srcdoc') return window.location.href;

  const { location: parentLocation } = window.parent;
  const urlParams = new URLSearchParams(parentLocation.search);
  return `${parentLocation.origin}${urlParams.get('path')}`;
}
```

### Use of `createOptimizedPicture` in lib-franklin

The `createOptimizedPicture` function in lib-franklin also [uses](https://github.com/adobe/helix-project-boilerplate/blob/c6ab59278d89a251c864fad1100f6de03a63a6fe/scripts/lib-franklin.js#L480) `window.location.href`. If you are using this function we recommend to move it into `scripts.js` and modify it to use the `getHref()` function above.

### Checking for the presence of the sidekick library

Sometimes you may want to know if the page or the block is running in the sidekick library. To do this there are a couple of options.

1. Check if `window.location.href === 'about:srcdoc'`
2. The `main` element and the block element will contain the `sidekick-library` class

## Building a Plugin

Developing a plugin is similar to constructing a block in Franklin. Once a user tries to load the plugin, the sidekick library will trigger the `decorate()` method on your plugin. This method receives the container to render the plugin in and any data that included in the plugins sheet.

```js
/**
 * Called when a user tries to load the plugin
 * @param {HTMLElement} container The container to render the plugin in
 * @param {Object} data The data contained in the plugin sheet
 * @param {String} query If search is active, the current search query
 * @param {Object} context contains any properties set when the plugin was registered
 */
export async function decorate(container, data, query, context) {
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
import { PLUGIN_EVENTS } from 'https://www.aem.live/tools/sidekick/library/events/events.js';

export async function decorate(container, data, query) {
  // Show a toast message
  container.dispatchEvent(new CustomEvent(PLUGIN_EVENTS.TOAST,  { detail: { message: 'Toast Shown!', variant: 'positive | negative' } }))
}
```

#### Show and Hide Loader

```js
import { PLUGIN_EVENTS } from 'https://www.aem.live/tools/sidekick/library/events/events.js';

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

If testing a customer configuration locally that does not have the correct CORS headers set you will have to run the in a browser with web security disabled.

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

