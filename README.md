# Sidekick Library

This repository contains the Library plugin for the [franklin sidekick](https://github.com/adobe/helix-sidekick-extension).

The library simplifies authoring workflows for users by

* Providing an extended surface for the franklin sidekick to display plugins that aid authors when writing content.
* Includes a `blocks` plugin that aggregates all the blocks (and there variations) for a franklin site into a single spot for authors to select from.
* It can aggregate libraries across multiple inherited projects into a single library.

## Status
[![codecov](https://img.shields.io/codecov/c/github/dylandepass/franklin-library.svg)](https://codecov.io/gh/dylandepass/franklin-library)
[![GitHub license](https://img.shields.io/github/license/dylandepass/franklin-library.svg)](https://github.com/dylandepass/franklin-library/blob/master/LICENSE.txt)
[![GitHub issues](https://img.shields.io/github/issues/dylandepass/franklin-library.svg)](https://github.com/dylandepass/franklin-library/issues)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

## How does it work?

The library can aggregate different data into a single application to aid authors when writing content for Franklin. It comes with a single `blocks` plugin that displays a list of all blocks and block variations to authors in an intuitive manner and removes the need for authors to have to remember or search for every variation of a block.

The library appication itself and the blocks plugin are hosted on `hlx.live` and is maintained by the franklin team. Customers are free to write their own plugins for the library or even write their own `blocks` plugin.

To intergrate with the sidekick library, customers need to create a spreadsheet that will define the plugins used along with any data required by the plugin to render.

## How to use the Sidekick Library?

The sidekick library is an application hosted on `hlx.live` that customers can add to their sidekick config at `tools/sidekick/config.json`. If this file does not exist, it must be created.

```json
{
  "project": "Boilerplate with Library",
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

The library is configured via the url parameters

| Parameter Name | Value                            | Description                                                                                                                     | Required |
|----------------|----------------------------------|---------------------------------------------------------------------------------------------------------------------------------|----------|
| base           | URL to the library               | The base library to be loaded                                                                                                   | true     |
| extended       | URL to the extended library      | A library to extend the base library with                                                                                       | false    |
| {plugin-name}  | URL to the custom plugin js file | For custom plugins, the parameter name should be the name of the plugin and the value should be a URL to the plugin source (js) | false    |

> The sidekick config must be checked into the `main` branch in order to for the plugin to appear in the sidekick.

### Library sheet setup

#### Create a directory to store all of the library content

In the root of the sites mountpoint, create a directory called `sidekick` (or any other name). For these steps it will be assumed the directory is called `sidekick`.

#### Create the library workbook

Create a workbook in the `sidekick` directory called `library`. Each sheet in the workbook is a plugin that will be loaded by the library. The name of the plugin to be loaded is determined by the name of the sheet. Any content contained in the sheet will be passed to the plugin.

> The sheet name needs to be prepended with `helix-` (example `helix-blocks`). 

Since this sheet will be loaded by the sidekick library from the `hlx.live` origin, the `access-control-allow-origin` header must be returned with the sheet. See [Custom Reponse Headers](https://www.hlx.live/docs/custom-headers) for more info how to set this up.

## Block library setup

1. Create a document called `columns` and inside the directory created above and define all the variations of the columns block ([Example](https://main--helix-test-content-onedrive--adobe.hlx.page/block-library-tests/blocks/columns/columns?view-doc-source=true))
2. Preview the `columns` document.
3. In the library workbook, create a sheet in the library workbook called `helix-blocks`.
4. In the `helix-blocks` sheet, create two columns, `name` and `path`.
5. For each block set you want to appear in the block library, create a new row with the `name` of the block and the `path` to the document containing all the block variations.
6. Preview and publish the `library` sheet.

## Demo
[Franklin Library](https://main--boilerplate-with-library--dylandepass.hlx.page/library/library?suppressFrame=true)

## Development

### Build

```bash
$ npm install
```

### Start

```bash
$ npm run start
```

### Test

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