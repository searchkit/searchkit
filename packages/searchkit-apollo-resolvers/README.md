# <a href="https://searchkit.co/">Searchkit</a>

## Searchkit Apollo Resolvers

[![npm version](https://badge.fury.io/js/%40searchkit%2Fclient.svg)](https://badge.fury.io/js/%40searchkit%2Fclient)

Searchkit Apollo Resolvers is a library which allows you to build a Search API designed for Search UI experiences on top of Apollo Server. It integrates with Elasticsearch to provide search features like full-text search, faceted filtering and query highlighting.   

## Documentation

All Searchkit documentation can be found at: <br/>
[https://searchkit.co/docs/](https://searchkit.co/docs/)

The Searchkit Apollo Resolvers API reference can be found at: <br/>
[https://searchkit.co/docs/reference/apollo-resolvers](https://searchkit.co/docs/reference/apollo-resolvers)

### Quick Intro
From a configuration

```js
const searchkitConfig = {
  host: 'https://localhost:9200',
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
      identifier
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

See [Schema Query Guide](https://searchkit.co/docs/guides/graphql-schema-queries-cheatsheet) for more examples.

