---
id: searchkit-schema
title: Searchkit Schema
sidebar_label: "@searchkit/schema"
slug: /reference/schema
---

## Initial Setup

```javascript

import {
  MultiMatchQuery,
  SearchkitSchema
} from '@searchkit/schema'

const searchkitConfig = {
  host: 'http://localhost:9200',
  index: 'my_index',
  hits: {
    fields: []
  },
  query: new MultiMatchQuery({ fields: [] }),
  facets: []
}

// Returns SDL + Resolvers for searchkit, based on the Searchkit config
const { typeDefs, withSearchkitResolvers, context } = SearchkitSchema({
  config: searchkitConfig, // searchkit configuration
  typeName: 'ResultSet', // type name for Searchkit Root
  hitTypeName: 'ResultHit', // type name for each search result
  addToQueryType: true // When true, adds a field called results to Query type 
})

const server = new ApolloServer({
  typeDefs: [
    gql`
    type Query {
      root: String
    }

    type HitFields {
      root: String
    }

    // Type name should match the hit typename
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

Key points:
1. `SearchkitSchema` returns the schema definition language (SDL), the resolvers and the context for searchkit required. SearchkitSchema requires a searchkit config and two typenames, one for the Searchkit Root (typeName) and another for the Hit item (hitTypeName). 
2. You need to define a type for each hit item. In above example, `ResultHit` is the type used for each hit result. This type needs to implement the SKHit interface and requires at least one field
3. `addToQueryType` adds a `results` field to the root Query object which is handled the Searchkit resolver. 

#### Options

| Option        | Description      |
| :------------- | :----------- |
| config          | Searchkit config  |
| typeName | String. The root type name for searchkit. |
| hitTypeName | String. The hit type that will be used for all hits. Should match a type you have implemented. See ResultHit example above |
| addToQueryType | Boolean. Adds a `results` field to the root Query object which is handled the Searchkit resolver. Set this to false if you want to implement the searchkit root field yourself. See [Customising GraphQL field](https://www.searchkit.co/docs/customisations/changing-graphql-types) section for more information |
| getBaseFilters | Allows you to pass an array of elasticsearch queries to filter results by. See [Adding base filters documentation](https://www.searchkit.co//docs/customisations/add-base-filters) for more information.

### Customising the Searchkit Types
- typeName: Specifies the type name used for the Searchkit root query. Configured on SearchkitSchema options.
- hitTypeName: specifies the hit type name used for each result hit. Configured on SearchkitSchema options. 

### Customising GraphQL field 
See [Customising types](https://www.searchkit.co/docs/customisations/changing-graphql-types)

### Multiple Searchkit configurations
see [Adding multiple searchkit configurations](https://www.searchkit.co/docs/customisations/multiple-searchkit-configurations)

# Searchkit Configuration

## Configuration Options

| Option        | Description      |
| :------------- | :----------- |
| postProcessRequest          | Optional. If you need to modify the request body before sending it to Elasticsearch, you can add a `postProcessRequest` function to your schema config. The method will recieve a request body argument which is the ES query that Searchkit API has built for your request. You function must return the request body, with your query changes. See postProcessRequest section for more information.    |
| host          | Required. The elasticsearch connection string  |


## Query

Query will be applied to results & facets. You need to configure a Query handler for this to work.

```gql
 {
  results(query: "heat") {
    hits {
      items {
        id
      }
    }
  }
}
    
```

### MultiMatchQuery
Uses [elasticsearch multi-match](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-multi-match-query.html) query.

#### Usage

```javascript
import {
  MultiMatchQuery
} from '@searchkit/schema'

const searchkitConfig = {
  query: new MultiMatchQuery({ fields: ['title^2', 'description']})
}

```

#### Options

| Option        | Description      |
| :------------- | :----------- |
| fields          | fields to be queried. See elasticsearch documentation for more information on options  |


### CustomQuery
Allows you to pass a function which will return an elasticsearch query filter. 
See [Query DSL](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html) for what options are available. This is great for when you have a query in mind to use.

#### Usage

```javascript
import {
  CustomQuery
} from '@searchkit/schema'

const searchkitConfig = {
  query: new CustomQuery({ 
    queryFn: (query, qm) => {
      return {
        bool: {
          must: [{
            wildcard: {
              field: {
                value: query + '*',
                boost: 1.0,
                rewrite: 'constant_score'
              }
            }
          }]
        }
      }
    }
  })
}

```

#### Options

| Option        | Description      |
| :------------- | :----------- |
| queryFn(query, queryManager)         | Function. Returns an array of filters. Query argument is the query string. queryManager argument is a class that keeps the query and filters that have been applied to search. For example you may want to adjust the query DSL based on what filters have been selected  |

## Sorting
```javascript
const searchkitConfig = {
  sortOptions: [
    { id: 'relevance', label: 'Relevance', field: '_score' },
    { id: 'released', label: 'Recent Releases', field: { released: 'desc' } },
    { id: 'multiple_sort', label: 'Multiple sort', field: [
      { "post_date" : {"order" : "asc"}},
      "user",
      { "name" : "desc" },
      { "age" : "desc" },
      "_score"
    ]},
  ]
}
```

Within SearchkitConfig, declare all the available sorting options that you want your search to support, each with a unique id. Above is an example of how sorting option fields can be declared. Field is provided to elasticsearch so supports all the options that elasticsearch supports. See [Elasticsearch sorting options](https://www.elastic.co/guide/en/elasticsearch/reference/7.x/sort-search-results.html) for available options.

#### GraphQL Query Example
Once configured, you are able to:
1. query available sort options via `sortOptions` within the summary node
2. sortedBy will tell you the current sort option for hits 

```gql
query {
  results(query: "") {
    summary {
      total
      sortOptions {
        id
        label
      }
    }
    hits(sortBy: "relevance") {
      sortedBy  <--- the current sortId
    }
  }
}


```

then you will be able to specify how you want hits to be sorted by within the hits node using the id

```gql
{
  results(query: "bla") {
    hits(sortBy: "relevance") {
      sortedBy
      items {
        ... on ResultHit {
          id
          fields {
            writers
            actors
          }
        }
      }
    }
  }
}
```

#### Options
| Option        | Description      |
| :------------- | :----------- |
| id          | Unique id. Used to specify what to sort by  |
| label          | label to be displayed in frontend  |



## Facets
Facets are configured together on the Searchkit Config within the facets array. Each facet can support a range of experiences from a simple list to date filtering

When configured, a GraphQL query using the facets node like below will bring back all the facet options for the result set. To apply a facet filter, you can specify the filter in the results arguments, shown below.  

```gql
 {
  results(filters: [{identifier: "type", value: "movie" }]) {
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
  }
}
```

The resolver also supports returning facet options for one particular facet via facet node.

```gql
 {
  results(query: "heat") {
    facet(identifier: "type") {
      identifier
      label
      type
      display
      entries {
        label
        count
      }
    }
  }
}
```

### RefinementSelectFacet
Returns a list of facet options that can be applied to refine the result set. 

#### Usage
```javascript
{
  RefinementSelectFacet
} from '@searchkit/schema'

const searchkitConfig = {
  ...
  facets: [
    new RefinementSelectFacet({ field: 'type.raw', identifier: 'type', label: 'Type' })
  ]
}
```

#### Selected Filter Example
```graphql
{
  results(filters: [{identifier: "type", value: "movie" }]) {
    summary {
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
    hits {
      items {
        id
      }
    }
  }
}

```

#### Multiple Select
Behaves like an OR filter. When configured and a filter is applied, facet will continue to return the same facet options as if the filter wasn't chosen. As more filters are applied, result matches will be of hits that have at least one of the filter values. 

#### Facet Value Query
Supports facet values querying via the facet node. Great for UIs where you have a large list of options and require search

```gql
 {
  results(query: "heat", filters: []) {
    facet(identifier: "type", query: "movi", size: 10) {
      identifier
      entries {
        label
        count
      }
    }
  }
}
```

#### Options

| Option        | Description      |
| :------------- | :----------- |
| field          | Aggregation field to be used, preferably a field that is raw, not tokenized  |
| id             | Required to be unique. Used to apply filters on field |
| label          | UI label for facet. Used by @searchkit/elastic-ui components |
| MultipleSelect | Boolean. Default False. Filters operates as an OR. See multiple Select for more information |
| size           | **Optional**. Controls the number of options displayed. Defaults to 5. 
| display        | **Optional**. Used on UI to specify what component to handle facet |

### HierarchicalMenuFacet
see [Hierarchical Menu Facet Page](https://searchkit.co/docs/build-your-own-components/hierarchical-facet) for more information

### RangeFilterFacet

#### Usage
```javascript
{
  RefinementSelectFacet
} from '@searchkit/schema'

const searchkitConfig = {
  ...
  facets: [
    new RangeFacet({
      field: 'metaScore',
      identifier: 'metascore',
      label: 'Metascore',
      range: {
        min: 0,
        max: 100,
        interval: 5
      }
    })
  ]
}
```

#### Selected Filter Example
```graphql
{
  results(filters: [{identifier: "metascore", min: 0, max: 100 }]) {
    hits {
      items {
        id
      }
    }
  }
}

```

#### Options

| Option        | Description      |
| :------------- | :----------- |
| field          | Aggregation field to be used, preferably a field that is raw, not tokenized  |
| id             | Required to be unique. Used to apply filters on field |
| label          | UI label for facet. Used by @searchkit/elastic-ui components |
| range | Object of min, max and interval. Brings back entries between min and max. Number of entries depends on interval |
| display        | **Optional**. Used on UI to specify what component to handle facet |


### DateRangeFacet

#### Usage
```javascript
{
  RefinementSelectFacet
} from '@searchkit/schema'

const searchkitConfig = {
  ...
  facets: [
    new DateRangeFacet({
      identifier: 'released',
      field: 'released',
      label: 'Released'
    })
  ]
}
```

#### Selected Filter Example
```graphql
{
  results(filters: [{identifier: "released", dateMin: "10/12/2020", dateMax: "10/12/2021" }]) {
    hits {
      items {
        id
      }
    }
  }
}

```

#### Options

| Option        | Description      |
| :------------- | :----------- |
| field          | Aggregation field to be used, preferably a field that is raw, not tokenized  |
| id             | Required to be unique. Used to apply filters on field |
| label          | UI label for facet. Used by @searchkit/elastic-ui components |
| display        | **Optional**. Used on UI to specify what component to handle facet |

## postProcessRequest
An escape hatch function which allows you to modify the ES request body before it is sent to elasticsearch

Every search request will pass through this function, containing the full body, and expecting a full request body back. 

```javascript
const searchkitConfig = {
  host: 'http://localhost:9200',
  index: 'my_index',
  hits: {
    fields: []
  },
  query: new MultiMatchQuery({ fields: [] }),
  postProcessRequest: (body) => {
    return { ...body, min_score: 10 };
  }
}
```

## Facet Visibility Rules

### VisibleWhen

#### Usage
```javascript
{
  VisibleWhen, FacetSelectedRule
} from '@searchkit/schema'

facets: [
  new RefinementSelectFacet({ identifier: 'type', field: 'type.raw', label: 'Type' }),
  VisibleWhen(
    [
      new RefinementSelectFacet({
        identifier: 'writers',
        field: 'writers.raw',
        label: 'Writers',
        display: 'override',
        multipleSelect: true
      }),
      new RefinementSelectFacet({
        identifier: 'actors',
        field: 'actors.raw',
        label: 'Actors'
      }),
      new RefinementSelectFacet({
        identifier: 'genres',
        field: 'genres.raw',
        label: 'Genres'
      })
    ],
    [ // All Rules must be satisfied for the facets to be visible
      FacetSelectedRule('type', 'Movie') // Visible only when Movie has been selected in type
    ]
  )
]
```

#### Options

| Option        | Description      |
| :------------- | :----------- |
| facets          | Required. An Array of facet configurations that will be displayed if the rule is satisfied  |
| rules             | Required. An array of rules |

### Rule: FacetSelectedRule

#### Usage
```javascript
{
  FacetSelectedRule
} from '@searchkit/schema'

    rules: [
      FacetSelectedRule('type', 'Movie')
    ]
```

| Option        | Description      |
| :------------- | :----------- |
| identifier          | Required. The facet identifier |
| value             | Optional. Without it provided, the rule will be satisfied for any applied filters matching the identifier. With value, will be satisfied for an applied filter with both identifier and value  |

### Rule: CustomRule
Allows you to build your own rule. You have access to the queryManager and ctx which are passed as arguments.

#### Usage
```javascript

const customRule = (queryManager, ctx: any) => {
  const userRole = ctx.userRole
  const filters = queryManager.getFiltersById("collection")
  if (userRole === "Admin" && filters[0].value === "People") {
    return true
  }
  return false
}
```

    rules: [
      customRule
    ]
```
