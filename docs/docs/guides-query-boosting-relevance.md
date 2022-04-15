---
id: guides-query-boosting-relevance
title: Query and Boosting
sidebar_label: Query, Boosting & Relevance
slug: /core/guides/query-boosting-relevance
keywords:
  [
    Elasticsearch Facets,
    GraphQL Facet Search,
    Searchkit Facet,
    Elasticsearch API,
    Customising Query,
  ]
description: Customising Query
---

Within Searchkit configuration, you can specify how you want to transform the query string into an elasticsearch query. Out of the box there are two options:

- MultiMatch Query
- Custom Query

### MultiMatch Query

Allows you to query multiple fields + adjustments on how important each field is.

```javascript
import {MultiMatchQuery} from '@searchkit/sdk';

const searchkitConfig = {
  query: new MultiMatchQuery({fields: ['title^2', 'description']}),
};
```

The above example will use the incoming query value and return documents which the query value match in either title or description. Title is boosted to 2x, making documents with a match in the title appear first on the result set.

### Custom Query

Allows you to have full control over the what the elasticsearch query should be, using the elasticsearch Query DSL.

```javascript
import {CustomQuery} from '@searchkit/sdk';

const searchkitConfig = {
  query: new CustomQuery({
    queryFn: (query, qm) => {
      // access current sort by option using the queryManager
      const sortLabel = qm.getSortBy()?.label;
      // access current filters applied to the search
      const filters = qm.getFilters();

      return {
        bool: {
          must: [
            {
              wildcard: {
                field: {
                  value: query + '*',
                  boost: 1.0,
                  rewrite: 'constant_score',
                },
              },
            },
          ],
        },
      };
    },
  }),
};
```

#### Query Options

When you need to be able to provide some sort of options at query time. Examples include:

- Advanced Search UI where customer can specify what fields to search by
- Customer wants to adjust which fields are the most relevant for their search

You can do this by using QueryOptions and CustomQuery.

```javascript
const request = Searchkit(config);
const response = await request
  .query('heat')
  .setQueryOptions({
    fields: ['title^2', 'description^1'],
  })
  .execute({
    hits: {
      size: 10,
      from: 0,
    },
  });
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

If you want to see the query thats being requested to Elasticsearch, use the `DEBUG_MODE=true` environment variable to log the query at every request. see [Debug Logging](https://searchkit.co/docs/customisations/server-logging#query-logging)
