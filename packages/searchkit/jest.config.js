// /** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testTimeout: 70000,
  setupFilesAfterEnv: ['<rootDir>/src/___tests___/support.ts'],
  // test the core's and the adapter's sources (not their builds), so the functional tests cover the packages as they are
  moduleNameMapper: {
    '^@searchkit/core$': '<rootDir>/../core/src/index.ts',
    '^@searchkit/adapter-elasticsearch$': '<rootDir>/../adapter-elasticsearch/src/index.ts'
  }
};