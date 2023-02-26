// const withTM = require("next-transpile-modules")(["@searchkit/api", "@searchkit/api"]);
const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.js',
  unstable_staticImage: true,
  flexsearch: {
    codeblocks: false
  },
})


// module.exports = withNextra(withTM({
//   // reactStrictMode: true,
// }));

module.exports = withNextra({
  async redirects() {
    return [
      {
        source: '/docs',
        destination: '/docs/getting-started/with-react',
        permanent: false,
      },
    ]
  },
});
