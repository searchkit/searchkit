import { Discord, Github } from "./components/Social";
import { useRouter } from 'next/router'

import { useConfig } from 'nextra-theme-docs'
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  project: { link: 'https://github.com/searchkit/searchkit'}, // GitHub link in the navbar
  docsRepositoryBase: 'https://github.com/searchkit/searchkit/tree/main/apps/web', // base URL for the docs repository
  useNextSeoProps() {
    return {
      titleTemplate: '%s – Searchkit'
    }
  },
  toc: {
    float: true
  },
  footer: { text: `Apache 2.0 ${new Date().getFullYear()} © Joseph McElroy.` },
  editLink: { text: `Edit this page on GitHub`, },
  logo: (
    <span className="text-xl font-semibold text-gray-100">Searchkit</span>
  ),
  project: {
    icon: Github,
    link: 'https://github.com/searchkit/searchkit/tree/main'
  },
  chat: {
    icon: Discord,
    link: 'https://discord.gg/CRuWmSQZQx',
  },
  nextThemes: {
    defaultTheme: "dark",
    forcedTheme: "dark"
  },
  head: () => {

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { frontMatter } = useConfig()
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { asPath: url } = useRouter()
    const host = "https://www.searchkit.co"
    return <>
      <meta property="og:url" content={host + url} />
      <link rel="canonical" href={host + url} />
      <meta property="og:title" content={frontMatter.title || "Searchkit - UI Widgets for Elasticsearch. React, Vue & Javascript supported"} />
      <meta property="og:description" content={frontMatter.description || "Searchkit - UI Widgets for Elasticsearch. React, Vue & Javascript supported"} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="keywords" content={frontMatter.keywords || "Elasticsearch, UI Library for Elasticsearch, React Search UI, Nodejs, Search UI components, NextJS Search, Elasticsearch Search UI, Instantsearch, Vue"} />
      <meta property="twitter:title"  content={frontMatter.title} />
      <meta property="twitter:description" content={frontMatter.description || "Elasticsearch, UI Library for Elasticsearch, React Search UI, Nodejs, Search UI components, NextJS Search, Elasticsearch Search UI, Instantsearch"}/>
      <meta property="twitter:url" content={host+url}/>
      <script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "c98b302ea3bb4a33a012a7ef0ab3e240"}'></script>
    </>
  },

}
