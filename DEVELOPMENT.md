## Setting up a development environment

Requirements:
- [Node.js](https://nodejs.org/en/) (v16.18.1 or higher)
- [Yarn](https://yarnpkg.com/) (v1.22.15 or higher)

1. Clone the repository and install dependencies:

```bash
yarn
```

2. Build the project:

```bash
yarn build
```

## Running Tests

We use [Jest](https://jestjs.io/) for testing. To run the tests, run `yarn test` from the root of the project.

```bash
yarn test
```

or running it in a particular package:

```bash
cd packages/searchkit
yarn test
```

## Functional Tests

These tests run against mocks of the Elasticsearch API. 

Tests are located in the `packages/searchkit/src/___tests___/functional` directory.
Mocks are located in the `packages/searchkit/src/___tests___/mocks` directory.

We use `nock` to mock the HTTP request to Elasticsearch, returning a apprioriate response with a mock.

To run the functional tests, run `yarn test` from within the `packages/searchkit` directory.

```bash
cd packages/searchkit
yarn test
```

```bash