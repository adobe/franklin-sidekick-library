# Franklin Library

This repository contains the Franklin Library plugin for the sidekick.

The franklin library simplifies authoring workflows for users by

* Providing a surface for franklin sites to display plugins right in context with their authoring tool (Word, Gdocs).
* Includes an out of the box set of plugins for customers to utilize (blocks, tags)
* The `block` plugin provides a list of all blocks and block variations to authors in an intuitive manner and removes the need for authors to have to remember or search for every variation of a block.
* It can aggregate plugins across multiple inherited projects into a single place.

## Status
[![codecov](https://img.shields.io/codecov/c/github/dylandepass/franklin-library.svg)](https://codecov.io/gh/dylandepass/franklin-library)
[![GitHub license](https://img.shields.io/github/license/dylandepass/franklin-library.svg)](https://github.com/dylandepass/franklin-library/blob/master/LICENSE.txt)
[![GitHub issues](https://img.shields.io/github/issues/dylandepass/franklin-library.svg)](https://github.com/dylandepass/franklin-library/issues)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

## How does it work?

The franklin library is an application that customer can connect their sidekick to. When configured, a button will be displayed in the sidekick allowing an author to launch the franklin library. The application itself is hosted of hlx.live and the core application is maintained by the franklin team. 

The library provides a plugin architecture allowing customers to build/load plugins that suit their needs. The application also provides a set of UI components that customers can use to render data within their plugin if they wish. When a plugin is loaded we also attempt to load a css for the plugin which will allow plugin authors to create any UI the please.


The library also includes a few plugins that are maintained by the franklin team.

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