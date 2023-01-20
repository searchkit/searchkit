const config = {
  transform: {
    "\\.[jt]sx?$": ["ts-jest", { "useESM": true }],
  },
  moduleNameMapper: {
    "(.+)\\.js": "$1"
  },
  extensionsToTreatAsEsm: [".ts"],
};

export default config;