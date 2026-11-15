// /** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testTimeout: 70000,
  // test against the core's sources (not its build)
  moduleNameMapper: {
    '^@searchkit/core$': '<rootDir>/../core/src/index.ts'
  }
};
