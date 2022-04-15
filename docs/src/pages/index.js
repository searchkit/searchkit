/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
[object Object]
 */
import React, { useEffect, useState } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Highlight, { defaultProps } from "prism-react-renderer";
import theme from "prism-react-renderer/themes/nightOwl";
import Head from '@docusaurus/Head'

const Navigation = () => (
  <div className="z-10 fixed top-0 left-0 right-0">
    <div className="bg-gray-900 border-b border-gray-800">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-3 flex items-center justify-between h-16">
            <span className="text-xl font-semibold text-gray-100">Searchkit</span>
          </div>
          <div className="md:col-span-9 items-center flex justify-between md:justify-end  space-x-6 h-16">
            <div className="flex justify-between md:justify-end items-center flex-1 md:space-x-2">
              <div>
                <a href="https://blog.searchkit.co" className="rounded-md py-2 px-3 inline-flex items-center leading-5 font-medium text-gray-100 betterhover:hover:bg-gray-100 hover:text-gray-100 hover:bg-gray-800 focus:outline-none focus:text-gray-900 focus:bg-gray-200 transition duration-150 ease-in-out">
                  Blog
                </a>
                <a href="https://discord.gg/CRuWmSQZQx" className="rounded-md py-2 px-3 inline-flex items-center leading-5 font-medium text-gray-100 betterhover:hover:bg-gray-100 hover:text-gray-100 hover:bg-gray-800 focus:outline-none focus:text-gray-900 focus:bg-gray-200 transition duration-150 ease-in-out">
                  Discord Chat
                </a>
                <a href="/docs" className="rounded-md py-2 px-3 inline-flex items-center leading-5 font-medium text-gray-100 betterhover:hover:bg-gray-100 hover:text-gray-100 hover:bg-gray-800 focus:outline-none focus:text-gray-900 focus:bg-gray-200 transition duration-150 ease-in-out">
                  Docs
                </a>
                <a href="https://demo.searchkit.co" className="rounded-md py-2 px-3 inline-flex items-center leading-5 font-medium text-gray-100 betterhover:hover:bg-gray-100 hover:text-gray-100 hover:bg-gray-800 focus:outline-none focus:text-gray-900 focus:bg-gray-200 transition duration-150 ease-in-out">
                  Demo
                </a>
              </div>
              <div>
                <a href="https://github.com/searchkit/searchkit" className="rounded-md py-2 px-3 inline-flex items-center leading-5 font-medium text-gray-100 betterhover:hover:bg-gray-900 hover:text-gray-900 hover:bg-gray-800 focus:outline-none focus:text-gray-900 focus:bg-gray-200 transition duration-150 ease-in-out">
                  <img src={useBaseUrl('img/github.png')} style={{ height: "28px"}} />
                </a></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

const HeroImage = ({ src='img/m/search.jpeg', width="580px", height="450px" }) => {

  return (
    <div className="flex rounded-lg overflow-hidden shadow-xl border-black border rounded-b-none" style={{
        backgroundImage: `url(${useBaseUrl(src)})`,
        backgroundSize: 'cover',
        width,
        height,
      }}>
    </div>
  )
}

const Hero = () => (
  <div className="relative bg-gray-900 overflow-hidden">
    <div className="py-24 mx-auto container px-4 mt-20 lg:mt-14 relative lg:pb-0">
      <div className="grid grid-cols-12">

        <div className="col-span-12 lg:col-span-5">
          <div className="text-center lg:text-left md:max-w-2xl md:mx-auto">
            <h1 className="text-4xl tracking-tight leading-10 font-extrabold text-gray-100 sm:leading-none sm:text-6xl lg:text-5xl xl:text-6xl">Search, <span className="block">made easy.</span></h1>
          </div>
          <p className="mt-3 text-base text-gray-400 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">Searchkit is an open source library which helps you build a great search experience with Elasticsearch.</p>
          <div className="mt-5  mx-auto sm:flex sm:justify-center lg:justify-start lg:mx-0 md:mt-8">
            <div className="rounded-md shadow">
              <a className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:border-gray-500 focus:shadow-outline-white transition duration-150 ease-in-out md:py-4 md:text-lg md:px-10" href="/docs">Get Started</a>
            </div>
            <div className="rounded-md shadow ml-3">
              <a className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-gray-100 bg-gray-900 hover:bg-gray-900 focus:outline-none focus:border-gray-900 focus:shadow-outline-blue transition duration-150 ease-in-out md:py-4 md:text-lg md:px-10 border-gray-900" href="https://demo.searchkit.co">View Demo</a>
            </div>
          </div>
        </div>
        <div className="hidden lg:block lg:col-span-7 md:ml-8 mb-5 lg:mb-0">
          <HeroImage />
        </div>
      </div>
    </div>
  </div>
)

const SyntaxHighlight = ({code, language='javascript', className: classNames, style: styles }) => {
  return (
    <Highlight {...defaultProps} code={code} theme={theme} language={language}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={className + " " + classNames} style={{
          ...style,
          ...styles,
          }}>
          {tokens.map((line, i) => (
            <div {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  )
}

const SearchkitSDKIntro = () => {

  const code = `
const searchkitConfig = {
  host: 'http://demo.searchkit.co/api/',
  index: 'movies',
  hits: {
    fields: [ 'title', 'plot', 'poster' ]
  },
  query: new MultiMatchQuery({
    fields: [ 'plot','title^4']
  }),
  facets: [
    new RefinementSelectFacet({
      field: 'type.raw',
      identifier: 'type',
      label: 'Type'
    }),
    new RefinementSelectFacet({
      field: 'writers.raw',
      identifier: 'writers',
      label: 'Writers',
      multipleSelect: true
    }),
    new RangeFacet({
      field: 'metaScore',
      identifier: 'metascore',
      label: 'Metascore',
      range: {
        min: 0,
        max: 100,
        interval: 5
      }
    }),
    new DateRangeFacet({
      field: 'released',
      identifier: 'released',
      label: 'Released'
    })
  ]
}
`

const code2 = `
{
  results(
    query: "heat",
    filters: [
      {
        id: "type",
        value: "movie"
      }
    ]) {
    facets {
      identifier
      label
      type
      display
      entries {
        label
        count
      }
    }
    hits {
      items {
        id
        fields {
          title
          writers
          actors
        }
      }
    }
  }
}
`
  const [activeView, setActiveView] = useState('code')
  useEffect(() => {
    const x = setInterval(() => {
      setActiveView((value) => {
        const newView = value === 'code' ? 'api' : 'code'
        setActiveView(newView)
      })
    }, 5000)

    return () => {
      clearInterval(x)
    }
  }, [])

  return (
    <div className="text-lg border-t border-gray-100 bg-white">
      <div className="py-24 mx-auto container px-4 sm:mt-8 relative">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 lg:col-span-6 overflow-hidden flex text-sm pb-60 transform transition-opacity duration-300 lg:mr-10">
                <SyntaxHighlight code={code} className="transform transition-opacity duration-300 w-full" style={{opacity: activeView === "api" ? 0 : 1 }} />
                <SyntaxHighlight code={code2} language="graphql" className="transform transition-opacity absolute duration-300 w-full" style={{opacity: activeView === "code" ? 0 : 1 }} />
            </div>
            <div className="lg:col-span-6 col-span-12 lg:pt-0 pt-6">
              <div className="text-center lg:text-left">
                <h2 className="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-3xl lg:text-3xl xl:text-3xl">GraphQL Integration</h2>
                <p className="mt-3 text-base text-gray-700 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">Searchkit GraphQL resolvers saves building a search focused API with common use cases such as facet filtering, pagination and querying.

                </p>
                <div className="mx-auto mt-8 text-base text-center">
                  <SyntaxHighlight code={`yarn add @searchkit/schema apollo-server`} language="shell" />
                </div>
                <div className="mt-5 mx-auto flex justify-left">
                  <div className="rounded-md shadow">
                    <a className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-gray-900 hover:bg-gray-700 focus:outline-none focus:border-gray-500 focus:shadow-outline-white transition duration-150 ease-in-out md:py-4 md:text-lg md:px-10" href="https://codesandbox.io/s/searchkit-graphql-example-if14fj">Fork</a>
                  </div>
                  <div className="rounded-md shadow ml-3">
                    <a className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-gray-900 bg-gray-000 hover:bg-gray-900 focus:outline-none focus:border-gray-900 focus:shadow-outline-blue transition duration-150 ease-in-out md:py-4 md:text-lg md:px-10 border-gray-900" href="https://demo.searchkit.co/api/graphql">View GraphQL Playground</a>
                  </div>
              </div>
              </div>
              <div className="flex flex-col justify-between mt-12 sm:flex-row">
                <div className="flex flex-col justify-between w-4/5">
                  <div className="flex flex-col justify-between">
                    <h3 className="text-xl font-bold mt-1">API designed for Search UI</h3>
                    <p className="mt-1">With Apollo, Elasticsearch and Searchkit's resolvers, its extremely quick to build a capable dev friendly search API.</p>
                  </div>
                  <div className="flex flex-col justify-between mt-20">
                    <h3 className="text-xl font-bold mt-1">Faceted Search made Simple</h3>
                    <p className="mt-1">Searchkit provides filtering on text, numbers and dates.</p>
                  </div>
                </div>
                <div className="flex flex-col justify-between w-4/5 sm:ml-10">
                  <div className="flex flex-col justify-between mt-20 sm:mt-0">
                    <h3 className="text-xl font-bold mt-1">Client Friendly</h3>
                    <p className="mt-1">All the heavy lifting is done by the API, making it easy to integrate your React website or Swift iOS App.</p>
                  </div>
                  <div className="flex flex-col justify-between mt-20">
                    <h3 className="text-xl font-bold mt-1">Flexible Customisation</h3>
                    <p className="mt-1">Easily extend and add your own facets. Write your own resolvers to provide information that comes from other sources, not just from elasticsearch.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
      </div>
    </div>
  )
}

const ConfigIntro = () => {

  const code = `
const searchkitConfig = {
  host: 'http://demo.searchkit.co/api/',
  index: 'movies',
  hits: {
    fields: [ 'title', 'plot', 'poster' ]
  },
  query: new MultiMatchQuery({
    fields: [ 'plot','title^4']
  }),
  facets: [
    new RefinementSelectFacet({
      field: 'type.raw',
      identifier: 'type',
      label: 'Type',
      multipleSelect: true
    }),
    new RangeFacet({
      field: 'metaScore',
      identifier: 'metascore',
      label: 'Metascore',
      range: {
        min: 0,
        max: 100,
        interval: 5
      }
    }),
    new DateRangeFacet({
      field: 'released',
      identifier: 'released',
      label: 'Released'
    })
  ]
}

const request = Searchkit(config);
const response = await request
  .setFilters([{identifier: 'type', value: 'movie'}])
  .execute({
    hits: {
      size: 10,
      from: 0,
    },
  });
`

  return (
    <div className="text-lg border-t border-gray-100 bg-white">
      <div className="py-24 mx-auto container px-4 sm:mt-8 relative">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 lg:col-span-6 overflow-hidden flex text-sm pb-60 transform transition-opacity duration-300 lg:mr-10">
                <SyntaxHighlight code={code} className="transform transition-opacity duration-300 w-full" />
            </div>
            <div className="lg:col-span-6 col-span-12 lg:pt-0 pt-6">
              <div className="text-center lg:text-left">
                <h2 className="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-3xl lg:text-3xl xl:text-3xl">Typescript SDK for Search</h2>
                <p className="mt-3 text-base text-gray-700 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">Works on the browser or Node.js. Integrates easily into your application.

                </p>
                <div className="mx-auto mt-8 text-base text-center">
                  <SyntaxHighlight code={`yarn add @searchkit/sdk`} language="shell" />
                </div>
                <div className="mt-5 mx-auto sm:flex justify-left md:mt-8">
                  <div className="rounded-md shadow">
                    <a className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-gray-900 hover:bg-gray-700 focus:outline-none focus:border-gray-500 focus:shadow-outline-white transition duration-150 ease-in-out md:py-4 md:text-lg md:px-10" href="/docs/core/overview/quick-start-guide">Start Tutorial</a>
                  </div>
                  <div className="rounded-md shadow ml-3">
                    <a className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-gray-900 bg-gray-000 hover:bg-gray-900 focus:outline-none focus:border-gray-900 focus:shadow-outline-blue transition duration-150 ease-in-out md:py-4 md:text-lg md:px-10 border-gray-900" href="https://demo.searchkit.co">View Demo</a>
                  </div>
              </div>
              </div>
              <div className="flex flex-col justify-between mt-12 sm:flex-row">
                <div className="flex flex-col justify-between w-4/5">
                  <div className="flex flex-col justify-between">
                    <h3 className="text-xl font-bold mt-1">SDK designed for Search UI</h3>
                    <p className="mt-1">Its extremely quick to integrate Elasticsearch into your API or frontend app.</p>
                  </div>
                  <div className="flex flex-col justify-between mt-20">
                    <h3 className="text-xl font-bold mt-1">Faceted Search made Simple</h3>
                    <p className="mt-1">Searchkit provides filtering on text, numbers and dates.</p>
                  </div>
                </div>
                <div className="flex flex-col justify-between w-4/5 sm:ml-10">
                  <div className="flex flex-col justify-between mt-20 sm:mt-0">
                    <h3 className="text-xl font-bold mt-1">Client Friendly</h3>
                    <p className="mt-1">All the heavy lifting is done by the SDK, making it easy to integrate your React website or Swift iOS App.</p>
                  </div>
                  <div className="flex flex-col justify-between mt-20">
                    <h3 className="text-xl font-bold mt-1">Flexible Customisation</h3>
                    <p className="mt-1">Easily extend and add your own facets. Write your own resolvers to provide information that comes from other sources, not just from elasticsearch.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
      </div>
    </div>
  )
}

const FrontendIntro = () => {
  return (
    <div className="text-lg border-t border-gray-400 bg-gray-900">
      <div className="py-24 mx-auto container px-4 md:mt-8 relative">
        <div className="md:col-span-6 col-span-12 md:pt-0 md:pt-6 pt-4">
          <video className="mx-auto" playsInline autoPlay muted loop src={useBaseUrl("movs/search-demo.mov")} />
        </div>
        <div className="md:col-span-6 col-span-12 pt-20">
          <div className="text-center">
            <h2 className="text-3xl tracking-tight font-extrabold text-gray-100 sm:text-3xl lg:text-3xl xl:text-3xl">Out the box React Components</h2>
            <p className="mt-3 text-base text-gray-400 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">For those who want a search UI quickly, Searchkit provides UI components out the box which work with Searchkit's API to bring a great search experience to your app. Searchkit components leverages Elastic's EUI react components.</p>
            <div className="mx-auto px-20 mt-8 text-base">
              <SyntaxHighlight code={`yarn add @searchkit/sdk @searchkit/client @searchkit/elastic-ui @elastic/eui`} language="shell" />
            </div>
            <div className="mt-5 mx-auto sm:flex justify-center md:mt-8">
              <div className="rounded-md shadow">
                <a className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:border-gray-500 focus:shadow-outline-white transition duration-150 ease-in-out md:py-4 md:text-lg md:px-10" href="https://demo.searchkit.co">View Demo</a>
              </div>
              <div className="rounded-md shadow ml-3">
                <a className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-gray-100 bg-gray-900 hover:bg-gray-900 focus:outline-none focus:border-gray-900 focus:shadow-outline-blue transition duration-150 ease-in-out md:py-4 md:text-lg md:px-10 border-gray-900" href="https://codesandbox.io/s/searchkit-cra-xj25o0">View Code Sandbox</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

const VideoIntro = () => {
  return (
    <div className="text-lg border-t border-gray-400 bg-gray-900">
      <div className="py-24 mx-auto container px-4 md:mt-8 relative">
        <div className="md:col-span-6 col-span-12 md:pt-0 md:pt-6 pt-4">
          <div className="relative h-0 overflow-hidden max-w-full w-full" style={{"padding-bottom": "56%"}}>
            <iframe className="absolute top-0 left-0 w-full h-full" src="https://www.youtube.com/embed/4vHibwubrQA?autoplay=1&mute=1"></iframe>
          </div>
        </div>
        <div className="md:col-span-6 col-span-12 pt-20">
          <div className="text-center">
            <h2 className="text-3xl tracking-tight font-extrabold text-white sm:text-3xl lg:text-3xl xl:text-3xl">Quick to get Started</h2>
            <p className="mt-3 text-base text-gray-200 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">Searchkit has example starter apps for you to get started really quickly.</p>
          </div>
          <div className="mt-5 mx-auto sm:flex justify-center md:mt-8">
              <div className="rounded-md shadow">
                <a className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-black bg-gray-300 hover:bg-gray-400 focus:outline-none focus:border-gray-500 focus:shadow-outline-white transition duration-150 ease-in-out md:py-4 md:text-lg md:px-10" href="https://codesandbox.io/s/searchkit-cra-xj25o0">Fork Code Sandbox Template</a>
              </div>
              <div className="rounded-md shadow ml-3">
                <a className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-gray-100 bg-gray-900 hover:bg-gray-900 focus:outline-none focus:border-gray-900 focus:shadow-outline-blue transition duration-150 ease-in-out md:py-4 md:text-lg md:px-10 border-gray-900" href="https://www.youtube.com/watch?v=4vHibwubrQA">Watch Getting Started Video</a>
              </div>
            </div>
        </div>
      </div>
    </div>

  )
}


function Home() {
  const context = useDocusaurusContext();

  return (
    <>
      <Head>
        <title>Searchkit | Search UI with elasticsearch, made easy. </title>
        <meta name="description" content="Search with Elasticsearch made easy. Browser & Node.js SDK and Out the box React components to build a great search experience."/>
        <meta name="keywords" content="Elasticsearch, GraphQL, React Search UI, Nodejs, Search UI components, NextJS Search, Elasticsearch Search UI" />
        <meta property="og:title" content="Searchkit - Search, made easy"/>
        <meta property="og:description" content="Search with Elasticsearch made easy. Browser & Node.js SDK and Out the box React components to build a great search experience."/>
        <meta property="og:image" content={useBaseUrl('img/m/search.jpeg')}/>
        <meta property="og:url" content="https://searchkit.co"/>
        <link data-react-helmet="true" rel="shortcut icon" href="/img/favicon.ico"/>
        <meta property="twitter:title" content="Searchkit - Search, made easy"/>
        <meta property="twitter:description" content="Search with Elasticsearch made easy. Browser & Node.js SDK and Out the box React components to build a great search experience."/>
        <meta property="twitter:image" content={useBaseUrl('img/m/search.jpeg')}/>
        <meta property="twitter:url" content="summary_large_image"/>
        <meta name="google-site-verification" content="nYA9IOgFmYP8znklDbiAGOx8fRXGvpQBX6NQmIKRwMA" />
      </Head>
    <div className="font-sans antialiased text-gray-900">
      <div className="h-full min-h-full">
        <Navigation />
        <Hero />
      </div>
      <ConfigIntro />
      <FrontendIntro />
      <SearchkitSDKIntro />
      <VideoIntro />
      <link rel="stylesheet" href="https://unpkg.com/tailwindcss@1.9.2/dist/tailwind.min.css" ></link>
    </div>
    </>
  );
}

export default Home;
