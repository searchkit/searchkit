// /** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testTimeout: 70000,
  // test/exports.test.ts imports the package by its own name to test the built entry point (dist/, via package.json).
  // pnpm doesn't link a package into its own node_modules, so map the name to this directory.
  moduleNameMapper: {
    '^@searchkit/api$': '<rootDir>'
  }
};
