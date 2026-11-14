module.exports = {
  root: true,
  extends: ["custom"],
  overrides: [
    {
      // Nextra's _meta.js loader only understands a literal `export default { ... }`.
      files: ["pages/**/_meta.js"],
      rules: {
        "import/no-anonymous-default-export": "off",
      },
    },
  ],
};
