# <a href="https://searchkit.co/">Searchkit</a>

## Searchkit SDK

[![npm version](https://badge.fury.io/js/%40searchkit%2Fsdk.svg)](https://badge.fury.io/js/%40searchkit%2Fsdk)

Searchkit SDK is a universal library which simplifies using Elasticsearch for search experiences. Universal library and Works on the browser (with fetch) and on node. 

Searchkit GraphQL uses this SDK behind the scenes. Ideal for those who:
- Use in conjunction with their own existing Node REST API
- Talk to Elasticsearch directly from the browser

## Documentation

All Searchkit documentation can be found at: <br/>
[https://searchkit.co/docs/](https://searchkit.co/docs/)

The Searchkit Schema API reference can be found at: <br/>
[https://searchkit.co/docs/reference/searchkit-sdk](https://searchkit.co/docs/reference/searchkit-sdk)

### Quick Intro
From a configuration

```js
import Searchkit from '@searchkit/sdk'
// Polyfill fetch for node environments
// import "cross-fetch/polyfill"

const searchkitConfig = {
  host: 'http://localhost:9200/', // elasticsearch instance url
  index: 'movies',
  hits: {
    fields: [ 'title', 'plot', 'poster' ]
  },
  query: new MultiMatchQuery({ 
    fields: [ 'plot','title^4'],
    highlightFields: ["title"]
  }),
  sortOptions: [
    { id: 'relevance', label: 'Relevance', field: '_score' },
    { id: 'released', label: 'Recent Releases', field: { released: 'desc' } }
  ],
  facets: [
    new RefinementSelectFacet({ 
      identifier: 'type',
      field: 'type.raw',
      label: 'Type'
    }),
    new RefinementSelectFacet({
      identifier: 'writers',
      field: 'writers.raw',
      label: 'Writers',
      multipleSelect: true
    }),
    new RangeFacet({
      identifier: 'metascore',
      field: 'metaScore',
      label: 'Metascore',
      range: {
        min: 0,
        max: 100,
        interval: 5
      }
    }),
    new DateRangeFacet({
      identifier: 'released',
      field: 'released',
      label: 'Released'
    })
  ]
}

const request = Searchkit(config)
const response = await request
  .query("heat")
  .setFilters([
    { identifier: "metascore", min: 10, max: 90 },
    { identifier: 'writers', value: 'writer1' },
    { identifier: 'actors', value: 'actors' }
  ])
  .setSortBy("released")
  .execute({
    facets: true,
    hits: {
      size: 10,
      from: 0
    }
  })

```

Searchkit SDK will generate the Elasticsearch queries required for this request, perform the request to Elasticsearch and transform the raw ES response into a friendly API response to build components on.  

