---
id: customisations-ui-add-new-facet-class
title: Building your own Facet
sidebar_label: Building your own Facet
slug: /core/customisations/add-new-facet
keywords:
  [
    Elasticsearch Facets,
    GraphQL Facet Search,
    Searchkit Facet,
    Elasticsearch API,
  ]
description: Building your own custom facet for Searchkit
---

You want to add a new type of facet which isn't currently supported by Searchkit. First create a Facet Class by implementing the BaseFacet interface.

```javascript
import {BaseFacet} from '@searchkit/schema';

export class CustomFacet implements BaseFacet {
  // whether Facet should exclude its own filters from
  // aggregation query.
  // When true, will return all aggregations for field
  // negating its own facet filters
  // Example: for multiple select filters
  // you want to show all aggregations for field even
  // when one filter was been chosen
  excludeOwnFilters: false;

  constructor(config) {
    this.config = config;
  }

  // must be unique to facet if not configured
  getIdentifier() {
    return this.config.identifier;
  }

  // return label for facet
  getLabel() {
    return this.config.label;
  }

  // return the elasticsearch aggregation query for facet
  // overrides are values specified at query time
  // Facet options can be size or query
  getAggregation(overrides: FacetOptions) {}

  // transform the facet's  filters into ES filter queries
  getFilters(filters: Array<MixedFilter>) {}

  // transform ES response into an object that matches the Facet Schema type
  transformResponse(response) {
    return {
      identifier: this.getIdentifier(),
      label: this.getLabel(),
      type: 'CustomFacet',
      display: 'ListFacet',
      customField: 'custom',
    };
  }

  // For appliedFilters. FilterSet is the filter applied to search. The return object
  // is used by appliedFilters for presentation
  getSelectedFilter(filterSet) {
    return {
      identifier: this.getIdentifier(),
      id: `${this.getIdentifier()}_${filterSet.value}`,
      label: this.getLabel(),
      display: 'ListFacet',
      type: 'CustomSelectedFilter',
      value: filterSet.value,
      customField: 'customField',
    };
  }
}
```

Then add a Facet type to the schema

```gql
type CustomFacet implements SKFacetSet {
  identifier: String
  label: String
  type: String
  display: String
  customField: String
}

type CustomSelectedFilter implements SKSelectedFilter {
  id: String!
  identifier: String!
  label: String!
  display: String!
  value: String
  customField: String
}
```

then you should be able to query for facet + see filters applied in summary

```gql
query {
  results {
    summary {
      appliedFilters {
        id
        identifier
        label
        display
        ... on CustomSelectedFilter {
          value
          customField
        }
      }
    }
    facets {
      ... on CustomFacet {
        identifier
        label
        type
        display
        customField
      }
    }
  }
}
```

If you want to see the query thats being requested to Elasticsearch, use the `DEBUG_MODE=true` environment variable to log the query at every request. see [Debug Logging](https://searchkit.co/docs/customisations/server-logging#query-logging)
