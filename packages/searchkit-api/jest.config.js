// /** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testTimeout: 70000,
  setupFilesAfterEnv: ['<rootDir>/src/___tests___/support.ts']
};