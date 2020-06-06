module.exports = {
  collectCoverageFrom: [
    "**/*.{ts,tsx}",
    "!**/node_modules/**",
  ],
  // setupFilesAfterEnv: ["./tests/support/jest.setup.js"],
  testPathIgnorePatterns: ["/node_modules/"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
};
