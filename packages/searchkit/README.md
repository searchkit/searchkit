# Elasticsearch Search UI Components
Searchkit is an open source library which helps you build a great search experience with **Elasticsearch**.
Works with Javascript, React, Vue, Angular, and more.

[![npm version](https://badge.fury.io/js/searchkit.svg)](https://badge.fury.io/js/searchkit)

[Website](https://www.searchkit.co/) | [Demos](https://www.searchkit.co/demos) | [Documentation](https://www.searchkit.co/docs/getting-started) | [Discord](https://discord.gg/CRuWmSQZQx)

# What is Searchkit?

Elasticsearch is a search engine that enables fast and accurate searching of large volumes of data, but it can take a lot of time and code to build a great search experience. 

Searchkit simplifies this process by providing a layer of abstraction on top of Elasticsearch. With Searchkit, you can use Instantsearch components like Searchbox, refinement filters and results (and many more!) to build a search experience, and it handles all the communication with Elasticsearch for you.

[Searchkit Query Rules](https://www.searchkit.co/docs/query-rules) allow you to adjust relevance of results easily. With actions and conditions, you can create rules that will automatically adjust the search results based on the user's query or filters.

Searchkit is great for anyone who want to build a search experience quickly.

**Searchkit to simplify using Elasticsearch for Search:**
  - UI Search Components for React, Vue, Angular, and more
  - Searchkit Node API proxies Elasticsearch requests from the browser.
  - Ability to use Elasticsearch Query DSL for advanced queries

## Quick Start Guides
* [Searchkit with Javascript](https://www.searchkit.co/docs/getting-started/with-javascript)
* [Searchkit with React](https://www.searchkit.co/docs/getting-started/with-react)
* [Searchkit with Vue](https://www.searchkit.co/docs/getting-started/with-vue)
* [Searchkit with Angular](https://www.searchkit.co/docs/getting-started/with-angular)

## Code Examples (on Github)
* [Searchkit with Next.JS](https://github.com/searchkit/searchkit/tree/main/examples/with-ui-nextjs-react)
* [Searchkit with Javascript](https://github.com/searchkit/searchkit/tree/main/examples/with-ui-instantsearchjs)
* [Searchkit with Vue](https://github.com/searchkit/searchkit/tree/main/examples/with-ui-vue)

## Components Docs
* [Searchkit Instantsearch Components](https://www.searchkit.co/docs/components/refinements/refinement-list)

## Proxy Elasticsearch Quick Starts
* [Searchkit with Next.js Functions](https://www.searchkit.co/docs/proxy-elasticsearch/with-next-js)
* [Searchkit with Cloudflare Workers](https://www.searchkit.co/docs/proxy-elasticsearch/with-cloudflare-workers)
* [Searchkit with Express.js](https://www.searchkit.co/docs/proxy-elasticsearch/with-express-js)

## Codesandbox Examples
* [Searchkit with JS Widgets](https://codesandbox.io/s/github/searchkit/searchkit/tree/main/examples/with-ui-instantsearchjs)
* [Searchkit with Vue](https://codesandbox.io/s/github/searchkit/searchkit/tree/main/examples/with-ui-vue)
* [Searchkit with Next.js](https://codesandbox.io/s/github/searchkit/searchkit/tree/main/examples/with-ui-nextjs-react)
* [Proxy with Express.js](https://codesandbox.io/s/github/searchkit/searchkit/tree/main/examples/proxy-elasticsearch/with-express-typescript-esm)

## Video Tutorials
* [Searchkit Intro Video Tutorial with Instantsearch.js](https://www.youtube.com/watch?v=R6iYpEuCdVs)
* [Searchkit Node API Video Tutorial](https://www.youtube.com/watch?v=8ztvn1-VZ_U)

## Tutorials
* [Searchkit with Next.js](https://www.searchkit.co/tutorials/with-nextjs)
* [Searchkit with Availability Search](https://www.searchkit.co/tutorials/build-availability-search-ui)

## Demos
* [Searchkit with Next.js](https://www.searchkit.co/demo)
* [Searchkit Geo Search](https://www.searchkit.co/geo-search-demo)
* [Searchkit with Nested Fields Search](https://www.searchkit.co/camping-sites-demo)
* [Searchkit Autocomplete](https://www.searchkit.co/autocomplete)

Or checkout our [documentation](https://searchkit.co/docs) for more examples.

## Installation

Either install via npm or yarn

```bash
npm install searchkit @searchkit/api @searchkit/instantsearch-client
```

or via CDN

```html
<script src="https://cdn.jsdelivr.net/npm/@searchkit/instantsearch-client@latest"></script>
<script src="https://cdn.jsdelivr.net/npm/instantsearch.js@4"></script>
<script src="https://cdn.jsdelivr.net/npm/searchkit@latest"></script>
```

## Setup Elasticsearch

Searchkit requires Elasticsearch 7.0 or higher or Opensearch 2.4 or higher. 

Below we are using Docker to run Elasticsearch.

```bash
docker pull docker.elastic.co/elasticsearch/elasticsearch:8.6.2
docker network create elastic
docker run --name elasticsearch --net elastic -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" -e "xpack.security.enabled=false" -e http.cors.enabled=true -e "http.cors.allow-origin='*'" -e http.cors.allow-headers=X-Requested-With,X-Auth-Token,Content-Type,Content-Length,Authorization -e http.cors.allow-credentials=true -e network.publish_host=localhost -e xpack.security.enabled=false docker.elastic.co/elasticsearch/elasticsearch:8.6.2
```

then lets add an index and some data

```bash
curl --location --request PUT 'http://localhost:9200/products' \
--header 'Content-Type: application/json' \
--data-raw '{
  "mappings": {
    "properties": {
      "name": {
        "type": "text"
      },
      "description": {
        "type": "text"
      },
      "price": {
        "type": "integer"
      },
      "categories": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword"
          }
        }
      }
    }
  }
}'

curl --location --request POST 'http://localhost:9200/products/_doc' \
--header 'Content-Type: application/json' \
--data-raw '{
  "name": "Apple iPhone 12 Pro Max",
  "description": "The iPhone 12 Pro Max is the most powerful iPhone ever. It has a 6.7-inch Super Retina XDR display, a Ceramic Shield front cover, and a triple-camera system with a LiDAR scanner. It also has a 5G connection, a 6-core CPU, and a 4-core GPU. The iPhone 12 Pro Max is available in 128GB, 256GB, and 512GB storage options.",
  "categories": ["phones", "apple"],
  "price": 800
}'
 
curl --location --request POST 'http://localhost:9200/products/_doc' \
--header 'Content-Type: application/json' \
--data-raw '{
  "name": "Apple iPhone 12 Pro",
  "description": "The iPhone 12 Pro is the most powerful iPhone ever. It has a 6.1-inch Super Retina XDR display, a Ceramic Shield front cover, and a triple-camera system with a LiDAR scanner. It also has a 5G connection, a 6-core CPU, and a 4-core GPU. The iPhone 12 Pro is available in 128GB, 256GB, and 512GB storage options.",
  "categories": ["phones", "apple"],
  "price": 700
}'
```

## Setup Searchkit

Searchkit compatible with all Instantsearch frameworks. Below is an example using react-instantsearch-hooks-web.

```tsx
import Searchkit from "searchkit"
import Client from '@searchkit/instantsearch-client'

// import your InstantSearch components
import { InstantSearch, SearchBox, Hits, RefinementList, Pagination, RangeInput } from 'react-instantsearch-hooks-web';

const sk = new Searchkit({
  connection: {
    host: 'http://localhost:9200',
    // with an apiKey
    // https://www.searchkit.co/docs/guides/setup-elasticsearch#connecting-with-api-key
    // apiKey: '##########'
    // with a username/password
    // https://www.searchkit.co/docs/guides/setup-elasticsearch#connecting-with-usernamepassword
    //auth: {
    //  username: "elastic",
    //  password: "changeme"
    //}
  },
  search_settings: {
    search_attributes: [{ field: 'title', weight: 3 }, 'actors', 'plot'],
    result_attributes: ['title', 'actors', 'poster', 'plot'],
    highlight_attributes: ['title'],
    facet_attributes: [
      { attribute: 'actors', field: 'actors.keyword', type: 'string' },
      { attribute: 'imdbrating', type: 'numeric', field: 'imdbrating' }
    ]
  }
})

const searchClient = Client(sk);

const App = () => (
  <InstantSearch
    indexName="imdb_movies"
    searchClient={searchClient}
  >
    <SearchBox />
    <div className="left-panel">
      <RefinementList attribute="actors" searchable={true} limit={10} />
      <RangeInput attribute="imdbrating" />
    </div>
    <div className="right-panel">
      <Hits />
      <Pagination />
    </div>
  </InstantSearch>
}
```

## Proxy Elasticsearch with Searchkit API

In above example, we are calling Elasticsearch directly from the browser. This is not recommended for production use. Instead, you should use the Searchkit API to proxy requests to Elasticsearch. With Searchkit, you can do this in a few lines of code.

### Frontend Changes
Update the client to specify the API url

```tsx
import Searchkit from "searchkit"
import Client from '@searchkit/instantsearch-client'

// import your InstantSearch components
import { InstantSearch, SearchBox, Hits, RefinementList, Pagination, RangeInput } from 'react-instantsearch-hooks-web';

const searchClient = Client({
    url: "/api/search",
});

const App = () => (
  <InstantSearch
    indexName="imdb_movies"
    searchClient={searchClient}
  >
    <SearchBox />
    <div className="left-panel">
      <RefinementList attribute="actors" searchable={true} limit={10} />
      <RangeInput attribute="imdbrating" />
    </div>
    <div className="right-panel">
      <Hits />
      <Pagination />
    </div>
  </InstantSearch>
}
```

### Backend Changes

Example below using Next.js API Routes. You can also use Cloudflare Workers or Vercel Edge Functions, or any other Node.js server.

```ts
import Client from '@searchkit/api'
import { NextApiRequest, NextApiResponse } from 'next'

const client = Client(
  {
    connection: {
      host: 'http://localhost:9200'
    },
    search_settings: {
      search_attributes: [{ field: 'title', weight: 3 }, 'actors', 'plot'],
      result_attributes: ['title', 'actors', 'poster', 'plot'],
      highlight_attributes: ['title'],
      facet_attributes: [
        { attribute: 'actors', field: 'actors.keyword', type: 'string' },
        { attribute: 'imdbrating', type: 'numeric', field: 'imdbrating' }
      ]
    }
  },
  { debug: true }
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const results = await client.handleRequest(req.body)
  res.send(results)
}
```

### Proxy Elasticsearch Quick Starts
* [Searchkit with Next.js Functions](https://www.searchkit.co/docs/proxy-elasticsearch/with-next-js)
* [Searchkit with Cloudflare Workers](https://www.searchkit.co/docs/proxy-elasticsearch/with-cloudflare-workers)
* [Searchkit with Express.js](https://www.searchkit.co/docs/proxy-elasticsearch/with-express-js)

## Query Rules

Query rules allows you to customize the behavior of the search experience. You can use query rules to boost or filter results, or to change the ranking of results, based on a set of conditions.

Below is an example of a query rule that boosts results for movies with Dan Aykroyd or Charlie Sheen, and filters results to only show movies if the query is the word "movie".

```js

{
  id: '1',
  conditions: [
    [
      {
        context: 'query',
        value: 'movie',
        match_type: 'exact'
      }
    ]
  ],
  actions: [
    {
      action: 'QueryBoost',
      query: 'actors:"Dan Aykroyd" OR actors:"Charlie Sheen"',
      weight: 2
    },
    {
      action: 'QueryFilter',
      query: 'type:"movie"'
    }
  ]
}

```

read more at [Query Rules](https://www.searchkit.co/docs/query-rules) docs.

### NPM Packages
* Searchkit [Documentation](https://www.searchkit.co/docs/api-documentation/searchkit)
* @searchkit/api [Documentation](https://www.searchkit.co/docs/api-documentation/api)
* @searchkit/instantsearch-client [Documentation](https://www.searchkit.co/docs/api-documentation/instantsearch-client)

## FAQ

**Q: Do I need to expose Elasticsearch to the public internet?**

Searchkit proxies requests to Elasticsearch.

Searchkit offers both options, either perform the search directly from the browser, or use the Searchkit API to proxy requests to Elasticsearch. Directly from the browser offers great developer experience & prototyping. Once you are ready to deploy, you can use the Searchkit API to proxy requests to Elasticsearch.

**Q: Do I need to use React?**

You can use React, React Native, Vue, Angular. You dont even need to use a frontend framework, you can use plain Javascript and HTML with instantsearch.js widgets.

**Q: Which version of Elasticsearch is supported?**

Searchkit is compatible with Elasticsearch 7.0 and above + Opensearch 2.0 and above.

**Q: Do you support Android and iOS?**

Potentially. Searchkit API mimics the Algolia API, so it should be possible to use the Algolia Instantsearch client with Searchkit API with a few tweaks. If you are interested in this, please let us know.

**Q: Why would I use Searchkit instead of Algolia?**

Elasticsearch has alot of advantages over Algolia. You might want to use Elasticsearch as a cheaper alternative to Algolia, especially if you have a large dataset. You might want to run Elasticsearch on your own infrastructure, or have greater control over the query relevance. 
