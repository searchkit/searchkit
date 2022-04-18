---
id: guides-using-filters
title: Filters
sidebar_label: Applying filters to Searchkit
slug: /sdk/customisations/filters
keywords: [Elasticsearch Filters, Searchkit Filters, Search Filters]
description: Searchkit custom filters
---

There are a few scenarios where you want to apply a filter to a search.

## User Filters

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

const request = Searchkit(config);
const response = await request
  .setFilters([{identifier: 'type', value: 'test'}])
  .execute({
    hits: {
      size: 10,
      from: 0,
    },
  });
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

## Base Filters

When you want to add a filter to a search where it is not shown within the UI & the user should not be able to remove it.

You can add lucene base filters to the search. This will be appended to the elasticsearch filter and will not appear within the `summary` response. Useful for restricting content to particular users.

This is done at the searchkit request execution phase.

```js
const response = await request.execute(
  {
    hits: {
      size: 10,
    },
  },
  [{term: {status: 'published'}}], // optional second argument with an array of lucene clauses
);
```

## Update elasticsearch query

For those edge cases where the above doesn't apply and you need raw access to the elasticsearch query to add any additional filters, you can use the `postProcessRequest` function. You can do this within the `searchkitConfig` configuration.

```javascript
const searchkitConfig = {
  host: 'http://localhost:9200',
  index: 'my_index',
  hits: {
    fields: [],
  },
  query: new MultiMatchQuery({fields: []}),
  postProcessRequest: (body) => {
    return {...body, min_score: 10};
  },
};
```
