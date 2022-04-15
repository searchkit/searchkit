---
id: customisations-adding-your-own-filters
title: Custom Filters
sidebar_label: Custom Filter
slug: /core/customisations/customisations-filters
keywords: [Elasticsearch Filters, Searchkit Filters, Search Filters]
description: Searchkit custom filters
---

When you want to apply filters to your search and don't want them to be displayed as facets. Some examples could include:

- Adding a search box for a particular filter

```javascript

class CustomFilter {
  excludeOwnFilters = false

  constructor() {}

  getIdentifier() {
    return "CustomFilter"
  }

  // returns the ES query. Requires to return a boolean query
  // https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-bool-query.html
  getFilters(filters) {
    return {
      "bool": {
        "filter" : filters.map((filter) => {
          return { "term" : {"tag": filter.value }}
        })
      }
    }
  }

  // powers the appliedFilters type for all filters added
  getSelectedFilter(filterSet) {
    return {
      type: 'ValueSelectedFilter',
      id: `${this.getIdentifier()}_${filterSet.value)}`,
      identifier: this.getIdentifier(),
      label: "Custom Filter",
      value: filterSet.value,
      display: "Custom"
    }
  }
}

const searchkitConfig = {
  host: process.env.ES_HOST || 'http://localhost:9200',
  index: 'us_parks',
  query: new MultiMatchQuery({ fields: ['title'] }),
  filters: [
    new CustomFilter()
  ]
}

```

With this configured, you should be able to apply a GQL query like below

```graphql
{
  results(filters: [{ identifier: "CustomFilter", value: "test" }]) {
    summary {
      appliedFilters {
        id
        identifier
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

```

If you're using `@searchkit/client`, you will be able to apply the filter like so

```javascript
const CustomFilterComponent = () => {
  const api = useSearchkit();

  return (
    <div>
      <a
        onClick={() => {
          api.toggleFilter({identifier: 'CustomFilter', value: 'test'});
          api.search();
        }}>
        Toggle test filter
      </a>
    </div>
  );
};
```
