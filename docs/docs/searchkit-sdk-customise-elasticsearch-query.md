---
id: searchkit-sdk-customise-elasticsearch-query
title: Transform Elasticsearch Query
sidebar_label: Transform Elasticsearch Query
slug: /core/reference/searchkit-sdk/transform-elasticsearch-query
---

## postProcessRequest

An escape hatch function which allows you to modify the ES request body before it is sent to elasticsearch

Every search request will pass through this function, containing the full body, and expecting a full request body back.

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
