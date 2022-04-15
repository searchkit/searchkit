---
id: sdk-customisations-ui-add-new-facet-class
title: Facet
sidebar_label: Custom Facet
slug: /core/reference/searchkit-sdk/facets/custom
keywords:
  [
    Elasticsearch Facets,
    GraphQL Facet Search,
    Searchkit Facet,
    Elasticsearch API,
  ]
description: Building your own custom facet for Searchkit
---

You can easily add your own facets which use Elasticsearch's aggregation API.

```javascript
import {BaseFacet} from '@searchkit/schema';

export class CustomFacet {
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

  // transform the facet's filters into ES filter queries
  getFilters(filters) {
    const condition = this.excludeOwnFilters ? 'should' : 'must';
    return {
      bool: {
        [condition]: filters.map((term) => ({
          term: {[this.config.field]: term.value},
        })),
      },
    };
  }

  // return the elasticsearch aggregation query for facet
  // overrides are values specified at query time
  // Facet options can be size or query
  getAggregation(overrides) {
    return {
      [this.getIdentifier()]: {
        terms: {
          field: this.config.field,
        },
      },
    };
  }

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

then you should be able to query for facet + see filters applied in summary

```javascript
const searchkitConfig = {
  host: process.env.ES_HOST || 'http://localhost:9200',
  index: 'us_parks',
  query: new MultiMatchQuery({fields: ['title']}),
  facets: [
    new CustomFacet({
      identifier: 'test',
      field: 'field',
      label: 'label',
    }),
  ],
};

const request = Searchkit(config);
const response = await request
  .setFilters([{identifier: 'test', value: 'test'}])
  .execute({
    hits: {
      size: 10,
      from: 0,
    },
  });
```
