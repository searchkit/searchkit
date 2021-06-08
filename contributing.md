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

## Running the examples/next demo app with locally compiled version of Searchkit packages

1. Run the make command `link-packages` within your terminal

`make link-packages`

This will create a symlink for all searchkit libraries to the examples/next application

2. At Searchkit root, keep the two following commands running in the background. Order of execution matters (needs to be core and then UI). This builds the libraries for example app to use. These commands will also continue to watch for changes and rebuild

`yarn run dev:core` in terminal / shell 1
`yarn run dev:ui` in terminal / shell 2

3. Run the next application in local development mode.

`cd ./examples/next && yarn start` in shell 3

Changes to any of the packages will automatically reload the next example app

4. Once you applied your changes and want to remove symlinks, run the make command `unlink-packages`

`make unlink-packages`

5. For your changes, create unit tests for coverage. Its advisable to run `unlink-packages` (above command) as your unit tests may not work as expected.