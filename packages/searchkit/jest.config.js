// /** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testTimeout: 70000,
  setupFilesAfterEnv: ['<rootDir>/src/___tests___/support.ts'],
  // test the adapter's sources (not its build), so the functional tests cover both packages as they are
  moduleNameMapper: {
    '^@searchkit/adapter-elasticsearch$': '<rootDir>/../adapter-elasticsearch/src/index.ts'
  }
};