## Developer Guide

### setup
- checkout project on the `develop` branch
- `yarn` to install dependencies

### Developing
- `npm run test:watch` to run searchkit's tests
- `npm run test:serve` to serve the test apps on `localhost:4000`. The Apps are in `test/e2e/server/apps` folder. Any updates to src are immediately reflected in the test apps.
- `npm run build` to build the `lib` folder (es5) and standalone release.

### Running E2Es
**experimental** `npm run test:e2e-standalone` to run e2es. Requires protractor v4 to be installed globally (npm i -g protractor ) and selenium webdriver to be running.
