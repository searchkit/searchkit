---
id: sdk-customisations-custom-filters
title: Filters
sidebar_label: Filters
slug: /core/sdk-customisations/customisations-filters
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

  // powers the summary.appliedFilters array value for when the filter is added
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

const request = Searchkit(config);
const response = await request
  .setFilters([
    { identifier: 'CustomFilter', value: 'test' }
  ])
  .execute({
    hits: {
      size: 10,
      from: 0,
    },
  });

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
