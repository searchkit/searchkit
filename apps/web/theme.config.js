import { Discord, Github } from "./components/Social";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  projectLink: 'https://github.com/searchkit/searchkit/tree/next', // GitHub link in the navbar
  docsRepositoryBase: 'https://github.com/searchkit/searchkit/tree/next', // base URL for the docs repository
  titleSuffix: ' – Searchkit',
  footer: true,
  search: false,
  toc: {
    float: true
  },
  footerText: `Apache 2.0 ${new Date().getFullYear()} © Joseph McElroy.`,
  footerEditLink: `Edit this page on GitHub`,
  logo: (
    <span className="text-xl font-semibold text-gray-100">Searchkit</span>
  ),
  project: {
    icon: Github,
  },
  chat: {
    icon: Discord,
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content="Searchkit is an open source library which helps you build a great search experience with Elasticsearch." />
      <meta name="og:title" content="Searchkit" />
    </>
  ),
}