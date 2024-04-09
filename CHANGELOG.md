## [1.8.1](https://github.com/adobe/franklin-sidekick-library/compare/v1.8.0...v1.8.1) (2024-04-09)


### Bug Fixes

* revert to hlx.live in app-model ([#108](https://github.com/adobe/franklin-sidekick-library/issues/108)) ([1a3974d](https://github.com/adobe/franklin-sidekick-library/commit/1a3974d36696915c77ed68402b667c25829956fc))

# [1.8.0](https://github.com/adobe/franklin-sidekick-library/compare/v1.7.0...v1.8.0) (2024-02-20)


### Bug Fixes

* sort templates alphabetically ([#101](https://github.com/adobe/franklin-sidekick-library/issues/101)) ([d7b6940](https://github.com/adobe/franklin-sidekick-library/commit/d7b694052bca517c2c3148b5e70be6664be6a9e3))


### Features

* allow content editable, copy button and details view to be disabled/hidden ([#107](https://github.com/adobe/franklin-sidekick-library/issues/107)) ([368537a](https://github.com/adobe/franklin-sidekick-library/commit/368537a68951105037c79ed95ae1b05a90fae2c6))

# [1.7.0](https://github.com/adobe/franklin-sidekick-library/compare/v1.6.4...v1.7.0) (2023-12-22)


### Features

* support for custom table header colors ([#99](https://github.com/adobe/franklin-sidekick-library/issues/99)) ([b4a2acd](https://github.com/adobe/franklin-sidekick-library/commit/b4a2acd93383362a88e508add01eb377a232e211))

## [1.6.4](https://github.com/adobe/franklin-sidekick-library/compare/v1.6.3...v1.6.4) (2023-12-13)


### Bug Fixes

* lowercase block names when copied ([#93](https://github.com/adobe/franklin-sidekick-library/issues/93)) ([f0b5656](https://github.com/adobe/franklin-sidekick-library/commit/f0b565635e67a300f86195e9ba9d4a584142a728))

## [1.6.3](https://github.com/adobe/franklin-sidekick-library/compare/v1.6.2...v1.6.3) (2023-12-13)


### Bug Fixes

* preserve data-align and data-valign when copying ([#94](https://github.com/adobe/franklin-sidekick-library/issues/94)) ([f1a43f1](https://github.com/adobe/franklin-sidekick-library/commit/f1a43f11862f82e9eae94061f7cd7a7153cb8ce6))

## [1.6.2](https://github.com/adobe/franklin-sidekick-library/compare/v1.6.1...v1.6.2) (2023-11-22)


### Bug Fixes

* **release:** combine both release actions in one workflow ([29ed3fc](https://github.com/adobe/franklin-sidekick-library/commit/29ed3fcdb24837794f7a849f3a263a75808e15c5))

## [1.6.1](https://github.com/adobe/franklin-sidekick-library/compare/v1.6.0...v1.6.1) (2023-11-22)


### Bug Fixes

* **release:** update package.json upon release, but don't publish to NPM ([e56f875](https://github.com/adobe/franklin-sidekick-library/commit/e56f875853c087f29cfb37aea3ba8421300305d7))

# [1.6.0](https://github.com/adobe/franklin-sidekick-library/compare/v1.5.7...v1.6.0) (2023-11-22)


### Features

* **release:** announce releases on discord ([28de448](https://github.com/adobe/franklin-sidekick-library/commit/28de44898ba51695662bff88ad5ccba375804c76))

## [1.5.7](https://github.com/adobe/franklin-sidekick-library/compare/v1.5.6...v1.5.7) (2023-10-27)


### Bug Fixes

* make block names author friendly when pasted ([#83](https://github.com/adobe/franklin-sidekick-library/issues/83)) ([52353d7](https://github.com/adobe/franklin-sidekick-library/commit/52353d781ef38134a905bd9b4d331c91c384df3a))

## [1.5.6](https://github.com/adobe/franklin-sidekick-library/compare/v1.5.5...v1.5.6) (2023-10-19)


### Bug Fixes

* don't try and parse descriptions in library metadata.. treat as HTML ([#77](https://github.com/adobe/franklin-sidekick-library/issues/77)) ([4ca0359](https://github.com/adobe/franklin-sidekick-library/commit/4ca035903a3bf08c9a6b788b943cddb1884dcfcc))
* store compound block flag in sectionMetadata instead of defaultMetadata ([#76](https://github.com/adobe/franklin-sidekick-library/issues/76)) ([c5c6b86](https://github.com/adobe/franklin-sidekick-library/commit/c5c6b86f88c90326c30224cc67235294ecf47d77))

## [1.5.5](https://github.com/adobe/franklin-sidekick-library/compare/v1.5.4...v1.5.5) (2023-09-18)


### Bug Fixes

* group all templates under a single `Templates` parent. ([#70](https://github.com/adobe/franklin-sidekick-library/issues/70)) ([6a191d6](https://github.com/adobe/franklin-sidekick-library/commit/6a191d667f657aeef552dd82cf36a05f07069ffe))

## [1.5.4](https://github.com/adobe/franklin-sidekick-library/compare/v1.5.3...v1.5.4) (2023-08-25)


### Bug Fixes

* only call decorateIcons in devMode ([#62](https://github.com/adobe/franklin-sidekick-library/issues/62)) ([3d555b4](https://github.com/adobe/franklin-sidekick-library/commit/3d555b46e2354401345f5a5c64bf92b982aee6d1))

## [1.5.3](https://github.com/adobe/franklin-sidekick-library/compare/v1.5.2...v1.5.3) (2023-07-28)


### Bug Fixes

* add sidekick library class to body element ([#57](https://github.com/adobe/franklin-sidekick-library/issues/57)) ([88d5a61](https://github.com/adobe/franklin-sidekick-library/commit/88d5a61a2ad06ce07dd71142fb4d93c24ee1090e))

## [1.5.2](https://github.com/adobe/franklin-sidekick-library/compare/v1.5.1...v1.5.2) (2023-07-26)


### Bug Fixes

* load plugin stylesheet before loading plugin js ([#52](https://github.com/adobe/franklin-sidekick-library/issues/52)) ([a7465d7](https://github.com/adobe/franklin-sidekick-library/commit/a7465d7e8325bf45109d27219a8bd581c290bc0a))
* only change source tag urls when running in devMode ([#54](https://github.com/adobe/franklin-sidekick-library/issues/54)) ([3308fdb](https://github.com/adobe/franklin-sidekick-library/commit/3308fdb9c87e10eb81bd6c73b9e500afba1230ac))

## [1.5.1](https://github.com/adobe/franklin-sidekick-library/compare/v1.5.0...v1.5.1) (2023-06-30)


### Bug Fixes

* bad img url when copying default content + tests ([f8decf6](https://github.com/adobe/franklin-sidekick-library/commit/f8decf60f83b27b922090bb74ab949333e1495c6))

# [1.5.0](https://github.com/adobe/franklin-sidekick-library/compare/v1.4.0...v1.5.0) (2023-06-29)


### Features

* deep linking support ([#48](https://github.com/adobe/franklin-sidekick-library/issues/48)) ([3d68cfc](https://github.com/adobe/franklin-sidekick-library/commit/3d68cfcc193b94756b95946952668ceca7bdd261))

# [1.4.0](https://github.com/adobe/franklin-sidekick-library/compare/v1.3.4...v1.4.0) (2023-06-28)


### Features

* autoblocks and default content support ([#47](https://github.com/adobe/franklin-sidekick-library/issues/47)) ([6dc5ee8](https://github.com/adobe/franklin-sidekick-library/commit/6dc5ee8c01846d43589273cfe764f2d8dcbb6199))

## [1.3.4](https://github.com/adobe/franklin-sidekick-library/compare/v1.3.3...v1.3.4) (2023-06-21)


### Bug Fixes

* include codeBasePath when loading ([#44](https://github.com/adobe/franklin-sidekick-library/issues/44)) ([5417eb3](https://github.com/adobe/franklin-sidekick-library/commit/5417eb373c067edbcab6c79c0d099dbe8167880e))

## [1.3.3](https://github.com/adobe/franklin-sidekick-library/compare/v1.3.2...v1.3.3) (2023-06-21)


### Bug Fixes

* clone block element before stripping it of it's library metadata ([#42](https://github.com/adobe/franklin-sidekick-library/issues/42)) ([43a3cc0](https://github.com/adobe/franklin-sidekick-library/commit/43a3cc00e15f5ad0cea8234bbd62f061f6aaaa7c))

## [1.3.2](https://github.com/adobe/franklin-sidekick-library/compare/v1.3.1...v1.3.2) (2023-06-20)


### Bug Fixes

* add sidekick-library class to main and block ([#38](https://github.com/adobe/franklin-sidekick-library/issues/38)) ([2dde39e](https://github.com/adobe/franklin-sidekick-library/commit/2dde39e39a1737870ea43fa3bd58a8b34859f737))

## [1.3.1](https://github.com/adobe/franklin-sidekick-library/compare/v1.3.0...v1.3.1) (2023-06-20)


### Bug Fixes

* duplicate section metadata when pasted from block with only sm ([#35](https://github.com/adobe/franklin-sidekick-library/issues/35)) ([0c6268e](https://github.com/adobe/franklin-sidekick-library/commit/0c6268ef60da46be9421fcf7e9ee3751fc25c351))

# [1.3.0](https://github.com/adobe/franklin-sidekick-library/compare/v1.2.0...v1.3.0) (2023-06-13)


### Features

* add rum collection ([#33](https://github.com/adobe/franklin-sidekick-library/issues/33)) ([9c29b81](https://github.com/adobe/franklin-sidekick-library/commit/9c29b81d8cbbe07a6255f6b7e4d4f2e8740e9b24))

# [1.2.0](https://github.com/adobe/franklin-sidekick-library/compare/v1.1.1...v1.2.0) (2023-06-09)


### Features

* Full screen sidekick library ([#25](https://github.com/adobe/franklin-sidekick-library/issues/25)) ([b1feeb6](https://github.com/adobe/franklin-sidekick-library/commit/b1feeb6959075de7b62ee4a538766eb8f9ea65f8))

## [1.1.1](https://github.com/adobe/franklin-sidekick-library/compare/v1.1.0...v1.1.1) (2023-05-02)


### Bug Fixes

* update host origin to hlx.live ([#20](https://github.com/adobe/franklin-sidekick-library/issues/20)) ([8465176](https://github.com/adobe/franklin-sidekick-library/commit/846517677c37e01591a468e1b92a0b2e20f58751))

# [1.1.0](https://github.com/adobe/franklin-sidekick-library/compare/v1.0.1...v1.1.0) (2023-05-02)


### Features

* add release workflow ([#19](https://github.com/adobe/franklin-sidekick-library/issues/19)) ([1665ffb](https://github.com/adobe/franklin-sidekick-library/commit/1665ffb0af1778c3c3bdcf405e29e1d99d9f8fad))

## [1.0.1](https://github.com/adobe/franklin-sidekick-library/compare/v1.0.0...v1.0.1) (2023-04-26)


### Bug Fixes

* demo gif [skip ci] ([fab412a](https://github.com/adobe/franklin-sidekick-library/commit/fab412a234ec1ed714b4289ff6fe960f13ff2c42))
* updates fixes ([#18](https://github.com/adobe/franklin-sidekick-library/issues/18)) ([51854da](https://github.com/adobe/franklin-sidekick-library/commit/51854da249dc119b1179e3fd7b505bc0c018f936))

# 1.0.0 (2023-04-19)


### Bug Fixes

* add concurrently ([ea9d872](https://github.com/dylandepass/franklin-sidekick-library/commit/ea9d87201cd3d02bb92ef0f83aa61227a6655d20))
* add files path ([3d348b7](https://github.com/dylandepass/franklin-sidekick-library/commit/3d348b7572fd47c7cd50cdc31f671ad074be0c71))
* add more tests to check coverage increase ([f839928](https://github.com/dylandepass/franklin-sidekick-library/commit/f83992868cdfea1a8377755a6cea573c26d43b5f))
* add semantic-release script ([cab6b73](https://github.com/dylandepass/franklin-sidekick-library/commit/cab6b733b4ede0e6176a1f40ad08957a4e6a54ca))
* add token permissions ([#17](https://github.com/dylandepass/franklin-sidekick-library/issues/17)) ([e977b07](https://github.com/dylandepass/franklin-sidekick-library/commit/e977b07e2d603824dd999fa033dad02c6e38d3f1))
* add util tests ([915390c](https://github.com/dylandepass/franklin-sidekick-library/commit/915390cbd12686cce4abbbd96007208634f1142e))
* add view tests ([16778f2](https://github.com/dylandepass/franklin-sidekick-library/commit/16778f2f4f4771ad13c2850504d3e189c8aee1e8))
* attempt to fix semantic release ([5dbe489](https://github.com/dylandepass/franklin-sidekick-library/commit/5dbe489d7a88172ba4bc9c3d0c641ba59829dead))
* block search ([f4f971b](https://github.com/dylandepass/franklin-sidekick-library/commit/f4f971b736762d2ab81aceadcc3069edb5d09852))
* blocks overflow ([86f0c06](https://github.com/dylandepass/franklin-sidekick-library/commit/86f0c06a2dbcefa003bcb78f668ef3be0e10a447))
* bug fixes, clean up and documentation ([e1dfa49](https://github.com/dylandepass/franklin-sidekick-library/commit/e1dfa493cc769b3d57ec0396c0c47054e75da6fd))
* build to index.js ([6a2757d](https://github.com/dylandepass/franklin-sidekick-library/commit/6a2757de6ff6831f1b74b12bf6dd33775ca76ec2))
* catch plugin errors ([127393b](https://github.com/dylandepass/franklin-sidekick-library/commit/127393bda714908131bc62e5795996f2576c1072))
* cleanup README ([abf9df8](https://github.com/dylandepass/franklin-sidekick-library/commit/abf9df87636cb4235c87343673bf325483da00c1))
* cleanup tests ([ed6b3d0](https://github.com/dylandepass/franklin-sidekick-library/commit/ed6b3d05614c6399452b58d9bd7bf8f4096a32d0))
* dev path ([ee351ec](https://github.com/dylandepass/franklin-sidekick-library/commit/ee351ec5faa42a7b8e707be959c30f0263dd377e))
* don't bundle from HTML ([c4d11f4](https://github.com/dylandepass/franklin-sidekick-library/commit/c4d11f42313b96402c7f8ad6d7a4f557525c218b))
* don't pass appStore ([f7cdfc1](https://github.com/dylandepass/franklin-sidekick-library/commit/f7cdfc1cab7861dadf9bd09fe2e67d3ac85b21e6))
* generate lcov ([66e5e8e](https://github.com/dylandepass/franklin-sidekick-library/commit/66e5e8e9e15e47343867734750ddff5731807270))
* include source maps ([bc56ca8](https://github.com/dylandepass/franklin-sidekick-library/commit/bc56ca8b7cb6186f095cf6904d065297bc248cb0))
* increase coverage ([e18db74](https://github.com/dylandepass/franklin-sidekick-library/commit/e18db748d4d871ec7d71fea4773c2fde8b312e92))
* link and format command ([8982d71](https://github.com/dylandepass/franklin-sidekick-library/commit/8982d71b4d2425291ea1a35018b9c42184ea650e))
* linting ([abc51eb](https://github.com/dylandepass/franklin-sidekick-library/commit/abc51eb9ec60eb6cff5ba24b3783a43b187db1ae))
* load from `tools/sidekick` ([7457730](https://github.com/dylandepass/franklin-sidekick-library/commit/745773076d1c78af6db557c2cf6703df32ac3cd4))
* more readme updates ([6fa4410](https://github.com/dylandepass/franklin-sidekick-library/commit/6fa4410504dec643fb5f4b57978ac1808a08d3a3))
* more tests, remove storybook ([b4e54fa](https://github.com/dylandepass/franklin-sidekick-library/commit/b4e54fa0f5495b9e5715ddd7c242afbce7f93cfe))
* organize and export plugin events ([751eab9](https://github.com/dylandepass/franklin-sidekick-library/commit/751eab90a60b889c446e64b246f7301ce89b1363))
* parse url params into config ([7517f76](https://github.com/dylandepass/franklin-sidekick-library/commit/7517f76b609460232293b78d4ce812abcdbebbbc))
* pathing issues ([6d1a301](https://github.com/dylandepass/franklin-sidekick-library/commit/6d1a30142c2b0d0c83a865d87ccc5bff20e65c79))
* readme update ([8115df9](https://github.com/dylandepass/franklin-sidekick-library/commit/8115df91432fbda13446125c0c88ac65dbcfb79f))
* readme update ([cdbc4b4](https://github.com/dylandepass/franklin-sidekick-library/commit/cdbc4b477901c66f9094fc629ea8f36147133a39))
* readme update ([8fe7b85](https://github.com/dylandepass/franklin-sidekick-library/commit/8fe7b85faeb878c252058b593b649eba39291009))
* remove preview demo ([9ff614a](https://github.com/dylandepass/franklin-sidekick-library/commit/9ff614aa2da79ae7dda977ae8ba7a35b6a67dfa7))
* rename and cleanup ([92b2c7c](https://github.com/dylandepass/franklin-sidekick-library/commit/92b2c7c847dc3e7bbbb4e3432b7400700a183da7))
* reset header title on plugin unload ([18d5ab7](https://github.com/dylandepass/franklin-sidekick-library/commit/18d5ab73b3e6a07b54398c260422d3583237a518))
* run in storybook-static directory ([18bbab2](https://github.com/dylandepass/franklin-sidekick-library/commit/18bbab28774c375d1ab8b6d6f6f8c033c6ac5879))
* send to codecov after storybook tests ([a66856b](https://github.com/dylandepass/franklin-sidekick-library/commit/a66856b5dce7c144f583ca1e9526ec357fb22146))
* support url config ([bbde8e7](https://github.com/dylandepass/franklin-sidekick-library/commit/bbde8e776e9a75e22b9217b24bddf16d11ca67d1))
* suppress frame ([e6ac001](https://github.com/dylandepass/franklin-sidekick-library/commit/e6ac00176b20ac30e408012df77cef37cc5d199e))
* tests after content update ([fa06a1c](https://github.com/dylandepass/franklin-sidekick-library/commit/fa06a1cbab290a35172ae90526443b571852262b))
* update demo link in README ([d95fa9e](https://github.com/dylandepass/franklin-sidekick-library/commit/d95fa9efe75da236adfb9e8784ddd744126fd024))
* update host ([a41dd12](https://github.com/dylandepass/franklin-sidekick-library/commit/a41dd12f0eba68270113e1f3e72d1a204b7188fd))
* update node version ([37dac3f](https://github.com/dylandepass/franklin-sidekick-library/commit/37dac3f15441543b99914a026e2e106d597de990))
* update package.json ([780a4af](https://github.com/dylandepass/franklin-sidekick-library/commit/780a4afc2aa21199e8b2a0e497c698c51951264c))
* update readme ([bce479c](https://github.com/dylandepass/franklin-sidekick-library/commit/bce479cb443bfa9161c8a79a09c696e6df3aa11f))
* update semantic release node version ([8632764](https://github.com/dylandepass/franklin-sidekick-library/commit/8632764fa73374c5a9e91077f50a1b238399d8e1))
* updates tests after fixing search ([384c2ac](https://github.com/dylandepass/franklin-sidekick-library/commit/384c2ac8075f416d02257c0af3539490c87bc00b))
* use base instead of library ([3f16c82](https://github.com/dylandepass/franklin-sidekick-library/commit/3f16c826ab1149963f1daaf8e41b8657069e281e))
* use test content ([cefb04f](https://github.com/dylandepass/franklin-sidekick-library/commit/cefb04f09618cb3793e9801578bac9e59841a868))


### Features

* add semantic release ([da267a6](https://github.com/dylandepass/franklin-sidekick-library/commit/da267a6da102b426c444fd2ef684ae864da7199a))
* add storybook tests and ci workflow ([ce0e894](https://github.com/dylandepass/franklin-sidekick-library/commit/ce0e8948fd08591cb5880d3b8cbc24b6635f31d0))
* run ci tests ([99dfc4b](https://github.com/dylandepass/franklin-sidekick-library/commit/99dfc4b0fe76aaa15fca7955a4a5528443ed43e7))
* support custom table colors ([371025d](https://github.com/dylandepass/franklin-sidekick-library/commit/371025df55fa78d796a9fcf3ade8f31bd01a047e))
