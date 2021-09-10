---
id: customisations-query-boosting-relevance
title: Custom Query and Boosting
sidebar_label: Custom Query and Boosting
slug: /customisations/customisations-query-boosting-relevance
keywords: Elasticsearch Facets, GraphQL Facet Search, Searchkit Facet, Elasticsearch API, Conditional Facets
description: Conditional facets
---

Within Searchkit configuration, you can specify how you want to transform the query string into an elasticsearch query. Out of the box there are two options:
- MultiMatch Query. Documentation [here](https://searchkit.co/docs/reference/schema#multimatchquery)
- Custom Query. Documentation [here](https://searchkit.co/docs/reference/schema#customquery)

### MultiMatch Query
Allows you to query multiple fields + adjustments on how important each field is. 

```javascript
import {
  MultiMatchQuery
} from '@searchkit/schema'

const searchkitConfig = {
  query: new MultiMatchQuery({ fields: ['title^2', 'description']})
}
```

The above example will use the incoming query value and return documents which the query value match in either title or description. Title is boosted to 2x, making documents with a match in the title appear first on the result set.

### Custom Query
Allows you to have full control over the what the elasticsearch query should be, using the elasticsearch Query DSL.

```javascript
import {
  CustomQuery
} from '@searchkit/schema'

const searchkitConfig = {
  query: new CustomQuery({ 
    queryFn: (query, qm) => {
      
      // access current sort by option using the queryManager
      const sortLabel = qm.getSortBy()?.label
      // access current filters applied to the search
      const filters = qm.getFilters()

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

#### Query Options
When you need to be able to provide some sort of options at query time. Examples include:
- Advanced Search UI where customer can specify what fields to search by
- Customer wants to adjust which fields are the most relevant for their search

You can do this by using QueryOptions and CustomQuery. Within the graphQL query, you can specify fields at query time

```graphql
{
  results(query:"heat", queryOptions: { fields: ["title^2", "description^1"]}) {
     hits {
       items {
          id
       }
     }
  }
}
```

and adjust the customQuery function to change the DSL based on the options

```javascript
const config: SearchkitConfig = {
  host: 'http://localhost:9200',
  index: 'movies',
  hits: {
    fields: ['actors', 'writers']
  },
  query: new CustomQuery({
    queryFn: (query, queryManager) => {
      const queryFields = queryManager.getQueryOptions()?.fields || []
      const mustBools = queryFields.map((qf) => {
        const matches = qf.match(/(.+)\^(\d)/)
        return {
          wildcard: {
            [matches[1]]: {
              value: query + '*',
              boost: matches[2],
              rewrite: 'constant_score'
            }
          }
        }
      })
      return {
        bool: {
          must: mustBools
      }
    }
  })
}
```
