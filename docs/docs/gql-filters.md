---
id: gql-filters
title: Filters
sidebar_label: Filters
slug: /graphql/customisations/filters
keywords: [Elasticsearch Filters, Searchkit Filters, Search Filters]
description: Searchkit custom filters
---

When you want to apply filters to your search and don't want them to be displayed as facets. Some examples could include:

- Adding a search box in UI which applies to one field
- Adding a date range component to UI

### Adding a filter to Searchkit Config

Within the Searchkit config, there is a filters array which allows you to configure one or more filters for your search. Below is an example of adding a term filter to search.

```javascript
const moviesSearchConfig = {
  host: 'http://localhost:9200',
  index: 'movies',
  hits: {
    fields: ['actors', 'writers'],
  },
  filters: [
    new TermFilter({
      identifier: 'type',
      field: 'type',
      label: 'type',
    }),
  ],
};
```

With this configured, you should be able to apply a GQL query like below

```graphql
{
  results(filters: [{identifier: "type", value: "test"}]) {
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
  }
}
```

and Searchkit will return all hit results that have a field type with a value of "test".

If you're using `@searchkit/client`, you will be able to apply the filter like so

```javascript
const CustomFilterComponent = () => {
  const api = useSearchkit();

  return (
    <div>
      <a
        onClick={() => {
          api.toggleFilter({identifier: 'type', value: 'test'});
          api.search();
        }}>
        Toggle test filter
      </a>
    </div>
  );
};
```
