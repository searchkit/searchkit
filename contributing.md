# Contributing to Searchkit

1. [Fork](https://help.github.com/articles/fork-a-repo/) this repository to your own GitHub account and then [clone](https://help.github.com/articles/cloning-a-repository/) it to your local device.
2. Create a new branch `git checkout -b MY_BRANCH_NAME`
3. Install yarn: `npm install -g yarn`
4. Install the dependencies: `yarn`

## To run tests

Running all unit tests:

```sh
yarn run test
```

## Running your own app with locally compiled version of Next.js

1. In your app's `package.json`, replace:

   ```json
   "@searchkit/schema": "<searchkit-version>",
   "@searchkit/client": "<searchkit-version>",
   "@searchkit/elastic-ui": "<searchkit-version>",

   ```

   with:

   ```json
   "@searchkit/schema": "file:<local-path-to-cloned-searchkit-repo>/packages/searchkit-schema",
   "@searchkit/client": "file:<local-path-to-cloned-searchkit-repo>/packages/searchkit-client",
   "@searchkit/elastic-ui": "file:<local-path-to-cloned-searchkit-repo>/packages/searchkit-elastic-ui",
   ```

2. In your app's root directory, make sure to remove `@searchkit` from `node_modules` with:

   ```sh
   rm -rf ./node_modules/@searchkit
   ```

3. In your app's root directory, run:

   ```sh
   yarn
   ```

   to re-install all of the dependencies.

   Note that @searchkit packages will be copied from the locally compiled version as opposed to from being downloaded from the NPM registry.

4. Run your application as you normally would.

5. To update your app's dependencies, after you've made changes to your local `@searchkit` repository. In your app's root directory, run:

   ```sh
   yarn install --force
   ```