/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

module.exports = {
  title: 'Searchkit',
  tagline: 'Search, made easy',
  url: 'https://searchkit.co',
  baseUrl: '/',
  onBrokenLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'searchkit', // Usually your GitHub org/user name.
  projectName: 'searchkit', // Usually your repo name.
  stylesheets: ['https://unpkg.com/tailwindcss@1.9.2/dist/tailwind.min.css'],
  themeConfig: {
    announcementBar: {
      id: 'searchkit_classic', // Any value that will identify this message.
      content:
        'Searchkit V2 Docs are accessible <a href="http://searchkit.github.io/searchkit/stable/">here</a>',
      backgroundColor: 'rgb(26,32,44)', // Defaults to `#fff`.
      textColor: '#fff', // Defaults to `#000`.
      isCloseable: false, // Defaults to `true`.
    },
    sidebarCollapsible: false,
    disableSwitch: true,
    respectPrefersColorScheme: false,
    gtag: {
      trackingID: 'G-Y1LWVCFZQK',
    },
    navbar: {
      title: 'Searchkit',
      items: [
        {
          href: '/docs',
          label: "Docs",
        },
        {
          href: '/docs/guides',
          label: "Guides",
        },
        {
          href: 'https://github.com/searchkit/searchkit',
          label: 'GitHub',
          position: 'right',
        }
      ],
    },
    footer: {
      style: 'dark',
      links: [

      ],
      // Please do not remove the credits, help to publicize Docusaurus :)
      copyright: `Copyright © ${new Date().getFullYear()} Ten Eleven, Inc. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/searchkit/searchkit/tree/next/docs/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/facebook/docusaurus/edit/master/website/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  plugins: []
};
