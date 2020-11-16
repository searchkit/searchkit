## Search, made easy
Searchkit is an open source toolkit which helps you build a great search experience with Elasticsearch.

Seachkit is Graph QL / React UI Component framework to:
  - Quickly build a GraphQL API focused on search UI
  - Out the box React components
  - A great Search experience without needing to be an expert in Elasticsearch, React and Node 

[Website](https://searchkit.co/) | [View Demo](https://demo.searchkit.co) | [Documentation](https://searchkit.co/docs)

[Read our blog post about Searchkit V3](https://blog.searchkit.co/searchkit-v3-enter-graphql-330e1aa5752d)

### Quick Intro
From a configuration

```js
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
      id: 'type',
      label: 'Type'
    }),
    new RefinementSelectFacet({
      field: 'writers.raw',
      id: 'writers',
      label: 'Writers',
      multipleSelect: true
    }),
    new RangeFacet({
      field: 'metaScore',
      id: 'metascore',
      label: 'Metascore',
      range: {
        min: 0,
        max: 100,
        interval: 5
      }
    }),
    new DateRangeFacet({
      field: 'released',
      id: 'released',
      label: 'Released'
    })
  ]
}
```

Will provide a GraphQL API where you can perform queries like:

#### Simple Hits
[Try it out](https://demo.searchkit.co/api/graphql)

```graphql
{
  results(query: "heat") {
    hits {
      items {
        id
        fields {
          title
        }
      }
    }
  }
}
```

#### Facets
[Try it out](https://demo.searchkit.co/api/graphql)

```graphql
{
  results(query: "heat") {
    facets {
      id
      label
      type
      display
      entries {
        id
        label
        count
      }
    }
    hits {
      items {
        id
        fields {
          title
        }
      }
    }
  }
}
```

#### Filtering
[Try it out](https://demo.searchkit.co/api/graphql)
```graphql
{
  results(filters: [{id: "type", value: "Movie"}, {id: "metascore", min: 30}]) {
    facets {
      id
      label
      type
      display
      entries {
        id
        label
        count
      }
    }
    hits {
      items {
        id
        fields {
          title
        }
      }
    }
  }
}
```

#### React Integration
We provide a thin [React client](https://searchkit.co/docs/reference/searchkit-client) which integrates with Searchkit's API, Apollo Client. It maintains search state (pagination, filtering and querying) and calls Apollo client to fetch.

#### React Components

```javascript
import {
  FacetsList,
  SearchBar,
  Pagination,
  ResetSearchButton,
  SelectedFilters
} from '@searchkit/elastic-ui'
```

See [quickstart guide](https://searchkit.co/docs/quick-start/ui/eui)

### Example Projects
* Next App with Searchkit & Elastic UI [Code](https://github.com/searchkit/searchkit/tree/next/examples/next) | [Demo](https://demo.searchkit.co)

### NPM Packages
* @searchkit/apollo-resolvers [Documentation](https://searchkit.co/docs/reference/searchkit-apollo-resolvers)
* @searchkit/client [Documentation](https://searchkit.co/docs/reference/searchkit-client)
* @searchkit/elastic-ui [Documentation](https://searchkit.co/docs/reference/searchkit-elastic-ui)

### FAQ
#### Can I upgrade from Searchkit v2?
Searchkit has undergone a total rewrite so whilst it should be straightforward to move onto, any code written for searchkit legacy wouldn't work on Searchkit v3.

#### Do I need to expose my Elasticsearch instance to the browser?
No! You dont expose your elasticsearch cluster to the browser, Search API sits in between elasticsearch and the browser.

#### I'm building a Native App / use angular. Do I need to use the Searchkit UI components?
No! Searchkit API provides a dev friendly search API. Searchkit simplifies using elasticsearch for search so that you can build your own UI components very easily. If your apps dont use react or you are building a native mobile app, you can just use the searchkit API. [See our blog article for more information](https://blog.searchkit.co/searchkit-why-graphql-aa886603b698)
