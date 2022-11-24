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
      <meta name="description" content="Searchkit is an open source library which helps you build a great search experience with Elasticsearch and Instantsearch." />
      <meta name="og:title" content="Searchkit" />
      <meta name="keywords" content="Elasticsearch, UI Library for Elasticsearch, React Search UI, Nodejs, Search UI components, NextJS Search, Elasticsearch Search UI, Instantsearch" />
      <meta property="og:url" content="https://beta.searchkit.co"/>
      <meta property="twitter:title" content="Searchkit - UI Library for Elasticsearch"/>
      <meta property="twitter:description" content="Searchkit is an open source library which helps you build a great search experience with Elasticsearch and Instantsearch."/>
      <meta property="twitter:url" content="summary_large_image"/>
      <meta name="google-site-verification" content="nYA9IOgFmYP8znklDbiAGOx8fRXGvpQBX6NQmIKRwMA" />
      <script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "c98b302ea3bb4a33a012a7ef0ab3e240"}'></script>
    </>
  ),
}