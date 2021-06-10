---
id: customisations-add-base-filters
title: Adding base filters
sidebar_label: Adding base filters
slug: /customisations/add-base-filters
---

You want to apply elastic-search filters on the API to filter results. You can do this with implementing the `getBaseFilters` method.

```javascript
  const { typeDefs, withSearchkitResolvers, context } = SearchkitSchema({
  config: searchkitConfig,
  typeName: 'ResultSet',
  hitTypeName: 'ResultHit',
  getBaseFilters: () => {
    return [
      { term: { "status": "published" }}
    ]
  }
})
```

This is done at schema level, allowing you to have multiple search schemas for different query types. Example below is two different queries, one for live content and another for staging.

```javascript
  const { typeDefs, withSearchkitResolvers, context } = SearchkitSchema({
  config: searchkitConfig,
  typeName: 'ResultSet',
  hitTypeName: 'ResultHit',
  getBaseFilters: () => {
    return [
      { term: { "status": "published" }}
    ]
  }
})

  const { typeDefs, withSearchkitResolvers, context } = SearchkitSchema({
  config: searchkitConfig,
  typeName: 'STGResultSet',
  hitTypeName: 'STGResultHit',
  getBaseFilters: () => {
    return [
      { term: { "status": "staging" }}
    ]
  }
})
```

If this isn't powerful enough and you want full control on the Elasticsearch query before it is requested, you can do this with implementing the method `postProcessRequest`. This is done at config level.

```javascript
const searchkitConfig = {
  host: 'http://localhost:9200',
  index: 'my_index',
  hits: {
    fields: []
  },
  query: new MultiMatchQuery({ fields: [] }),
  postProcessRequest: (body) => {
    return { ...body, min_score: 10 };
  }
}
```
