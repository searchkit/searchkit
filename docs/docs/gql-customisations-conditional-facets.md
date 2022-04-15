---
id: gql-customisations-conditional-facets
title: Conditional Facets
sidebar_label: Conditional Facets
slug: /graphql/customisations/conditional-facets
keywords:
  [
    Elasticsearch Facets,
    GraphQL Facet Search,
    Searchkit Facet,
    Elasticsearch API,
    Conditional Facets,
  ]
description: Conditional facets
---

Searchkit provides the functionality to add conditions to when to show facets.

Examples of usecases:

- I want to show "CPU Socket type" facets when the customer has selected to filter by "motherboards"
- I want to show different filters depending on the user's role and authorization groups.

The advantages being able to customise the experience around what the customer is filtering for and who they are. Reducing the number of facets also has performance benefits meaning searches will be faster.

You can achieve this by using `VisibleWhen` and using the out the box ruleset or building your own custom visibility rules. `VisibleWhen` will return these facets only when certain conditions are met.

```javascript
import {VisibleWhen, FacetSelectedRule} from '@searchkit/schema';

const config: SearchkitConfig = {
  host: 'http://localhost:9200',
  index: 'movies',
  hits: {
    fields: ['actors', 'writers'],
  },
  query: new MultiMatchQuery({
    fields: ['actors', 'writers', 'title^4', 'plot'],
  }),
  facets: [
    new RefinementSelectFacet({
      identifier: 'type',
      field: 'type.raw',
      label: 'Type',
    }),
    VisibleWhen(
      [
        new RefinementSelectFacet({
          identifier: 'writers',
          field: 'writers.raw',
          label: 'Writers',
          display: 'override',
          multipleSelect: true,
        }),
        new RefinementSelectFacet({
          identifier: 'actors',
          field: 'actors.raw',
          label: 'Actors',
        }),
        new RefinementSelectFacet({
          identifier: 'genres',
          field: 'genres.raw',
          label: 'Genres',
        }),
      ],
      [
        // All Rules must be satisfied for the facets to be visible
        FacetSelectedRule('type', 'Movie'), // Visible only when Movie has been selected in type
      ],
    ),
  ],
};
```

In this example, on the initial query only the type facet will be returned in the response. When you add a type filter with the value of "Movie", Searchkit API will return you all four facets.

If a writer filter was also added and the type filter was removed, Searchkit API will ignore the writer filter. Applying the filter will have no affect to the search.

The filters that have been applied and disabled will appear in the summary type under `appliedFilters` and `disabledFilters`

```gql
{
  results(query: "", filters: [{identifier: "writers", "example"}]) {
    summary {
      appliedFilters {
        identifier
      }
      disabledFilters {
        identifier
      }
    }
    hits(page: {size: 10, from: 0 }) {
      items {
        id
      }
    }
    facets {
      identifier
      type
      label
      display
      entries {
        count
        label
      }
    }
  }
}
```

Example where for the above config, writers filters will appear in the disabledFilters array and will be ignored by searchkit.

#### FacetSelectedRule

Rule which is satisfied when a filter has been applied to the search. Facet Identifier is required, value is optional.

```javascript
FacetSelectedRule('type'), FacetSelectedRule('writers', 'Famous Writer');
```

#### Custom Rule

You can build a customrule for your usecase. Two important arguments are:

- `queryManager` which you will be able to access the query & filters applied to the search.
- `ctx` which is the GraphQL context, normally used to store information about the request.

```javascript
let customRule = (queryManager, ctx: any) => {
  const userRole = ctx.userRole;
  const filters = queryManager.getFiltersById('collection');
  if (userRole === 'Admin' && filters[0].value === 'People') {
    return true;
  }
  return false;
};
```
