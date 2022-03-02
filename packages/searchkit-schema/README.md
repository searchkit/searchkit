# <a href="https://searchkit.co/">Searchkit</a>

## Searchkit GraphQL Schema 

[![npm version](https://badge.fury.io/js/%40searchkit%2Fschema.svg)](https://badge.fury.io/js/%40searchkit%2Fschema)

Searchkit Schema is a library which allows you to build a GraphQL Search API designed for Search UI experiences with configuration. It integrates with Elasticsearch to provide search features like full-text search, faceted filtering, sorting, relevency tweaking and query highlighting.   

## Documentation

All Searchkit documentation can be found at: <br/>
[https://searchkit.co/docs/](https://searchkit.co/docs/)

The Searchkit Schema API reference can be found at: <br/>
[https://searchkit.co/docs/reference/schema](https://searchkit.co/docs/reference/schema)

### Quick Intro
From a configuration

```js
const searchkitConfig = {
  host: 'http://localhost:9200/', // elasticsearch instance url
  index: 'movies',
  hits: {
    fields: [ 'title', 'plot', 'poster' ]
  },
  query: new MultiMatchQuery({ 
    fields: [ 'plot','title^4'] 
  }),
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

const { typeDefs, withSearchkitResolvers, context } = SearchkitSchema({
  config: searchkitConfig,
  typeName: 'ResultSet', 
  hitTypeName: 'ResultHit',
  addToQueryType: true 
})

const server = new ApolloServer({
  typeDefs: [
    gql`
    type Query {
      root: String
    }

    type HitFields {
      title: String
    }

    type ResultHit implements SKHit {
      id: ID!
      fields: HitFields
    }
  `, ...typeDefs
  ],
  resolvers: withSearchkitResolvers({}),
  introspection: true,
  playground: true,
  context: {
    ...context
  }
})
```

Will provide a GraphQL API where you can perform queries like:

#### Simple Hits
[Try it out](https://demo.searchkit.co/api/graphql)

```graphql
{
  results(query: "heat") {
    hits {
      items {
        ... on ResultHit {
          id
          fields {
            title
          }
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
  results(filters: [{identifier: "type", value: "Movie"}, {identifier: "metascore", min: 30}]) {
    summary {
      appliedFilters {
        appliedFilters {
          identifier
          id
          label
          display
          ... on ValueSelectedFilter {
            value
          }
        }
      }
    }
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
        ... on ResultHit {
          id
          fields {
            title
          }
        }
      }
    }
  }
}
```

See [Schema Query Guide](https://searchkit.co/docs/guides/graphql-schema-queries-cheatsheet) for more examples.

### Getting highlights for matches

See [highlighting fields](https://searchkit.co/docs/guides/highlighting-fields) for more information.