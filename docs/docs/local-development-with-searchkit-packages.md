---
id: local-development-with-searchkit-packages
title: Local Development with Searchkit packages
sidebar_label: Contributing to Searchkit
slug: /core/contributing/local-development
---

You can run the example project with locally compiled versions of the Searchkit packages.

### Instructions

1. In Searchkit root, keep the two following commands running in the background.

   Order of execution matters (needs to be core and then UI). This builds the libraries for example app to use. These commands will also continue to watch for changes and rebuild

   In terminal #1:

   ```shell
   yarn run dev:core
   ```

   In terminal #2:

   ```shell
   yarn run dev:ui
   ```

2. Run the next application in local development mode.

   In terminal #3:

   ```shell
   cd ./examples/next && yarn start
   ```

   Changes to any of the packages will automatically reload the next example app

3. For your changes, create unit tests for coverage.
