# Great search experiences, made easy.
Searchkit is an open source library which helps you build a great search experience with **Elasticsearch**.

Works with React, Vue, Angular, and more.

[Website](https://beta.searchkit.co/) | [Demos](https://beta.searchkit.co/demos) | [Documentation](https://beta.searchkit.co/docs/getting-started) | [Discord](https://discord.gg/CRuWmSQZQx)

**Searchkit to simplify using Elasticsearch for Search:**
  - Support for **Edge Function Platforms** like Cloudflare and Vercel Edge functions
  - Integrates with Instantsearch UI components for React, Vue, Angular, and more
  - A great Search experience without needing to be an expert in Elasticsearch
  - GraphQL Support (coming soon!)

## Looking for the old Searchkit?
- [Searchkit v3 Docs](https://v3.searchkit.co/docs)

```tsx
import Searchkit from "searchkit"
import Client from '@searchkit/instantsearch-client'

// import your InstantSearch components
import { InstantSearch, SearchBox, Hits, RefinementList, Pagination, NumericMenu } from 'react-instantsearch-dom';

const sk = new Searchkit({
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
})

const searchClient = Client(searchkitClient);

const App = () => (
  <InstantSearch
    indexName="imdb_movies"
    searchClient={searchClient}
  >
    <SearchBox />
    <div className="left-panel">
      <RefinementList attribute="actors" searchable={true} limit={10} />
      <NumericMenu
        attribute="imdbrating"
        items={[
          { label: '5 - 7', start: 5, end: 7 },
          { label: '7 - 9', start: 7, end: 9 },
          { label: '>= 9', start: 9 },
        ]}
      />
    </div>
    <div className="right-panel">
      <Hits />
      <Pagination />
    </div>
  </InstantSearch>
}
```

#### Move to Node API

In above example, we are calling Elasticsearch directly from the browser. This is not recommended for production use. Instead, you should use the Searchkit API to proxy requests to Elasticsearch. With Searchkit, you can do this in a few lines of code.

### Frontend Changes

```tsx
import Searchkit from "searchkit"
import Client from '@searchkit/instantsearch-client'

// import your InstantSearch components
import { InstantSearch, SearchBox, Hits, RefinementList, Pagination, NumericMenu } from 'react-instantsearch-dom';

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
      <NumericMenu
        attribute="imdbrating"
        items={[
          { label: '5 - 7', start: 5, end: 7 },
          { label: '7 - 9', start: 7, end: 9 },
          { label: '>= 9', start: 9 },
        ]}
      />
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

### Query Rules

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

### NPM Packages
* @searchkit/api [Documentation](https://beta.searchkit.co/docs/api-documentation/api)
* @searchkit/instantsearch-client [Documentation](https://beta.searchkit.co/docs/api-documentation/instantsearch-client)


