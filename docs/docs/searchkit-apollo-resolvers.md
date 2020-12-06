---
id: searchkit-apollo-resolver
title: Searchkit Apollo Resolvers
sidebar_label: "@searchkit/apollo-resolvers"
slug: /reference/apollo-resolvers
---

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
} from '@searchkit/apollo-resolvers'

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
} from '@searchkit/apollo-resolvers'

const searchkitConfig = {
  query: new CustomQuery({ 
    queryFn: (query, qm) => {
      return {
        wildcard: {
          field: {
            value: query + '*',
            boost: 1.0,
            rewrite: 'constant_score'
          }
        }
      }
    }
  })
}

```

#### Options

| Option        | Description      |
| :------------- | :----------- |
| queryFn(query, queryManager)         | Function. Query argument is the query string. queryManager argument is a class that keeps the query and filters that have been applied to search. For example you may want to adjust the query DSL based on what filters have been selected  |

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
        id
        fields {
          writers
          actors
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
        id
        label
        count
        isSelected
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
        id
        label
        count
        isSelected
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
} from '@searchkit/apollo-resolvers'

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
      id
      entries {
        id
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

### RangeFilterFacet

#### Usage
```javascript
{
  RefinementSelectFacet
} from '@searchkit/apollo-resolvers'

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
} from '@searchkit/apollo-resolvers'

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

