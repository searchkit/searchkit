---
id: guides-using-filters
title: Filters
sidebar_label: Filters
slug: /customisations/filters
keywords: Elasticsearch Filters, Searchkit Filters, Search Filters
description: Searchkit custom filters
---

When you want to apply filters to your search and don't want them to be displayed as facets. Some examples could include:
- Adding a search box for a particular filter
- Want to apply a numeric range filter

```javascript


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
}

```

If you're using `@searchkit/client`, you will be able to apply the filter like so

```javascript
const CustomFilterComponent = () => {
  const api = useSearchkit()

  return (
    <div>
      <a onClick={() => {
        api.toggleFilter({ identifier: "CustomFilter", value: "test" })
        api.search()
      }}>Toggle test filter</a>
    </div>
  )
}

```