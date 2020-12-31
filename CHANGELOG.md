# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.0.0-canary.25](https://github.com/searchkit/searchkit/compare/v3.0.0-canary.19...v3.0.0-canary.25) (2020-12-31)


### Bug Fixes

* **searchkit/cli:** fix issue with cli not working ([#826](https://github.com/searchkit/searchkit/issues/826)) ([1a9784d](https://github.com/searchkit/searchkit/commit/1a9784d634fe6331b42b0af63a4dbe37a95269f3))


### Features

* **resolvers:** add id for filters ([#833](https://github.com/searchkit/searchkit/issues/833)) ([4a06d07](https://github.com/searchkit/searchkit/commit/4a06d075cb92deac013252e4c98bb6480e67e66c))
* **schema:** customise typename for root and ([fdd8ab0](https://github.com/searchkit/searchkit/commit/fdd8ab000cca44747e6ec414909e2f614a8cbb24))





# [3.0.0-canary.24](https://github.com/searchkit/searchkit/compare/v3.0.0-canary.19...v3.0.0-canary.24) (2020-12-27)


### Bug Fixes

* **searchkit/cli:** fix issue with cli not working ([#826](https://github.com/searchkit/searchkit/issues/826)) ([1a9784d](https://github.com/searchkit/searchkit/commit/1a9784d634fe6331b42b0af63a4dbe37a95269f3))


### Features

* **resolvers:** add id for filters ([#833](https://github.com/searchkit/searchkit/issues/833)) ([4a06d07](https://github.com/searchkit/searchkit/commit/4a06d075cb92deac013252e4c98bb6480e67e66c))





# [3.0.0-canary.23](https://github.com/searchkit/searchkit/compare/v3.0.0-canary.19...v3.0.0-canary.23) (2020-12-20)


### Bug Fixes

* **client:** bug fix for unable to remove filter when range min is 0 ([93bd74e](https://github.com/searchkit/searchkit/commit/93bd74eeda712fb658f2deeb9b5908f087268bd9))
* **rangeslider:** fix slider when boundaries are not 0-100 ([ee22887](https://github.com/searchkit/searchkit/commit/ee2288780702a6799c2f27b87c2f2721983181ca)), closes [#827](https://github.com/searchkit/searchkit/issues/827)
* **searchkit/cli:** fix issue with cli not working ([#826](https://github.com/searchkit/searchkit/issues/826)) ([1a9784d](https://github.com/searchkit/searchkit/commit/1a9784d634fe6331b42b0af63a4dbe37a95269f3))


### Features

* re-order facets ([1f28f4c](https://github.com/searchkit/searchkit/commit/1f28f4c36c9089fcecc6d45f985d889784796949))





# [3.0.0-canary.22](https://github.com/searchkit/searchkit/compare/v3.0.0-canary.19...v3.0.0-canary.22) (2020-12-19)

**Note:** Version bump only for package searchkit





# [3.0.0-canary.21](https://github.com/searchkit/searchkit/compare/v3.0.0-canary.19...v3.0.0-canary.21) (2020-12-17)

**Note:** Version bump only for package searchkit





# [3.0.0-canary.20](https://github.com/searchkit/searchkit/compare/v3.0.0-canary.19...v3.0.0-canary.20) (2020-12-13)


### Bug Fixes

* fix error where input was uncontrolled ([9f474ff](https://github.com/searchkit/searchkit/commit/9f474ffdad59262d85433ee332799cd5046cd467))


### Features

* allow query to be adjusted ([407384f](https://github.com/searchkit/searchkit/commit/407384fea64c6a7c2e7651934d7ae080798734ce)), closes [#806](https://github.com/searchkit/searchkit/issues/806)
* **searchbar:** if query is set, use it as default value ([b7543aa](https://github.com/searchkit/searchkit/commit/b7543aaf4c1ac2d5cb0c8b33ae6b9cf6c1aff30e)), closes [#809](https://github.com/searchkit/searchkit/issues/809)





# [3.0.0-canary.19](https://github.com/searchkit/searchkit/compare/v3.0.0-canary.12...v3.0.0-canary.19) (2020-12-07)


### Bug Fixes

* facet size can be configured / changed at query time ([#796](https://github.com/searchkit/searchkit/issues/796)) ([beb567f](https://github.com/searchkit/searchkit/commit/beb567f931ffe7013d11251e7d8beeaf4a473f35)), closes [#791](https://github.com/searchkit/searchkit/issues/791)
* fix apollo client cache issues ([#800](https://github.com/searchkit/searchkit/issues/800)) ([3aa1385](https://github.com/searchkit/searchkit/commit/3aa1385da6d9d338e951e89b950a3963f7931392)), closes [#797](https://github.com/searchkit/searchkit/issues/797)
* link ([#783](https://github.com/searchkit/searchkit/issues/783)) ([55f6f6f](https://github.com/searchkit/searchkit/commit/55f6f6f541f274f4c9249da63f98088be3f6ba4e))


### Performance Improvements

* **searchkitrequest:** improve https performance using custom http agent ([f20ae3c](https://github.com/searchkit/searchkit/commit/f20ae3cb5703ef49a3ecf4b844826c9244a9f362))


### BREAKING CHANGES

* For all facets, id now is identifier. Apollo client network policy is now the
default cache-first strategy





# [3.0.0-canary.18](https://github.com/searchkit/searchkit/compare/v3.0.0-canary.12...v3.0.0-canary.18) (2020-12-06)


### Bug Fixes

* **combobox:** issue with combobox applying filters ([42b3a8c](https://github.com/searchkit/searchkit/commit/42b3a8c613232fb420378930182eada964958ccb))
* facet size can be configured / changed at query time ([#796](https://github.com/searchkit/searchkit/issues/796)) ([beb567f](https://github.com/searchkit/searchkit/commit/beb567f931ffe7013d11251e7d8beeaf4a473f35)), closes [#791](https://github.com/searchkit/searchkit/issues/791)
* fix apollo client cache issues ([#800](https://github.com/searchkit/searchkit/issues/800)) ([3aa1385](https://github.com/searchkit/searchkit/commit/3aa1385da6d9d338e951e89b950a3963f7931392)), closes [#797](https://github.com/searchkit/searchkit/issues/797)
* link ([#783](https://github.com/searchkit/searchkit/issues/783)) ([55f6f6f](https://github.com/searchkit/searchkit/commit/55f6f6f541f274f4c9249da63f98088be3f6ba4e))


### BREAKING CHANGES

* For all facets, id now is identifier. Apollo client network policy is now the
default cache-first strategy





# [3.0.0-canary.17](https://github.com/searchkit/searchkit/compare/v3.0.0-canary.12...v3.0.0-canary.17) (2020-12-05)


### Bug Fixes

* facet size can be configured / changed at query time ([#796](https://github.com/searchkit/searchkit/issues/796)) ([beb567f](https://github.com/searchkit/searchkit/commit/beb567f931ffe7013d11251e7d8beeaf4a473f35)), closes [#791](https://github.com/searchkit/searchkit/issues/791)
* fix apollo client cache issues ([da9191b](https://github.com/searchkit/searchkit/commit/da9191b4528fc72f73ffdbf3e1f92de3f88231fc)), closes [#797](https://github.com/searchkit/searchkit/issues/797)
* link ([#783](https://github.com/searchkit/searchkit/issues/783)) ([55f6f6f](https://github.com/searchkit/searchkit/commit/55f6f6f541f274f4c9249da63f98088be3f6ba4e))


### BREAKING CHANGES

* For all facets, id now is identifier. Apollo client network policy is now the
default cache-first strategy





# [3.0.0-canary.16](https://github.com/searchkit/searchkit/compare/v3.0.0-canary.12...v3.0.0-canary.16) (2020-12-04)


### Bug Fixes

* better compatibility support for es6 / es7 over total ([ce6a92c](https://github.com/searchkit/searchkit/commit/ce6a92cf6e9a3f14f46f08fe9f75b38561e511b2)), closes [#792](https://github.com/searchkit/searchkit/issues/792)
* link ([#783](https://github.com/searchkit/searchkit/issues/783)) ([55f6f6f](https://github.com/searchkit/searchkit/commit/55f6f6f541f274f4c9249da63f98088be3f6ba4e))





# [3.0.0-canary.15](https://github.com/searchkit/searchkit/compare/v3.0.0-canary.12...v3.0.0-canary.15) (2020-12-03)


### Bug Fixes

* link ([#783](https://github.com/searchkit/searchkit/issues/783)) ([55f6f6f](https://github.com/searchkit/searchkit/commit/55f6f6f541f274f4c9249da63f98088be3f6ba4e))





# [3.0.0-canary.14](https://github.com/searchkit/searchkit/compare/v3.0.0-canary.12...v3.0.0-canary.14) (2020-12-01)


### Bug Fixes

* link ([#783](https://github.com/searchkit/searchkit/issues/783)) ([55f6f6f](https://github.com/searchkit/searchkit/commit/55f6f6f541f274f4c9249da63f98088be3f6ba4e))





# [3.0.0-canary.13](https://github.com/searchkit/searchkit/compare/v3.0.0-canary.12...v3.0.0-canary.13) (2020-11-18)

**Note:** Version bump only for package searchkit





# [3.0.0-canary.12](https://github.com/searchkit/searchkit/compare/v2.3.0...v3.0.0-canary.12) (2020-11-16)


### Features

* fix deployment ([71a1c26](https://github.com/searchkit/searchkit/commit/71a1c264a0c01519ad14f28b6966380f85102513))





# [3.0.0-canary.11](https://github.com/searchkit/searchkit/compare/v2.3.0...v3.0.0-canary.11) (2020-11-14)


### Features

* fix deployment ([71a1c26](https://github.com/searchkit/searchkit/commit/71a1c264a0c01519ad14f28b6966380f85102513))





# [3.0.0-canary.10](https://github.com/searchkit/searchkit/compare/v2.3.0...v3.0.0-canary.10) (2020-11-13)


### Features

* fix deployment ([71a1c26](https://github.com/searchkit/searchkit/commit/71a1c264a0c01519ad14f28b6966380f85102513))





# [3.0.0-canary.9](https://github.com/searchkit/searchkit/compare/v2.3.0...v3.0.0-canary.9) (2020-11-13)


### Features

* fix deployment ([71a1c26](https://github.com/searchkit/searchkit/commit/71a1c264a0c01519ad14f28b6966380f85102513))





# [3.0.0-canary.8](https://github.com/searchkit/searchkit/compare/v2.3.0...v3.0.0-canary.8) (2020-11-11)


### Features

* fix deployment ([71a1c26](https://github.com/searchkit/searchkit/commit/71a1c264a0c01519ad14f28b6966380f85102513))





# [3.0.0-canary.7](https://github.com/searchkit/searchkit/compare/v2.3.0...v3.0.0-canary.7) (2020-11-10)


### Features

* fix deployment ([71a1c26](https://github.com/searchkit/searchkit/commit/71a1c264a0c01519ad14f28b6966380f85102513))





# [3.0.0-canary.6](https://github.com/searchkit/searchkit/compare/v2.3.0...v3.0.0-canary.6) (2020-11-10)


### Features

* fix deployment ([71a1c26](https://github.com/searchkit/searchkit/commit/71a1c264a0c01519ad14f28b6966380f85102513))





# [3.0.0-canary.5](https://github.com/searchkit/searchkit/compare/v2.3.0...v3.0.0-canary.5) (2020-11-08)


### Features

* fix deployment ([71a1c26](https://github.com/searchkit/searchkit/commit/71a1c264a0c01519ad14f28b6966380f85102513))





# [3.0.0-canary.4](https://github.com/searchkit/searchkit/compare/v2.3.0...v3.0.0-canary.4) (2020-11-08)


### Features

* fix deployment ([71a1c26](https://github.com/searchkit/searchkit/commit/71a1c264a0c01519ad14f28b6966380f85102513))





# [3.0.0-canary.3](https://github.com/searchkit/searchkit/compare/v2.3.0...v3.0.0-canary.3) (2020-10-11)


### Features

* fix deployment ([71a1c26](https://github.com/searchkit/searchkit/commit/71a1c264a0c01519ad14f28b6966380f85102513))





# [3.0.0-canary.2](https://github.com/searchkit/searchkit/compare/v2.3.0...v3.0.0-canary.2) (2020-10-11)


### Features

* fix deployment ([71a1c26](https://github.com/searchkit/searchkit/commit/71a1c264a0c01519ad14f28b6966380f85102513))
