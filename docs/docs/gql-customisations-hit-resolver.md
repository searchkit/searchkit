---
id: gql-customisations-hit-resolver
title: Integrate your own data sources
sidebar_label: Integrate your own data sources
slug: /graphql/customisations/extending-hit-result
keywords:
  [Custom Resolver, Elasticsearch GraphQL, Postgres Database, MySQL Database]
description: Enrich your hits resolver with data from other databases
---

## Customise Hits via a Resolver

1. Add to the schema and update the type that has been configured as the `hitTypeName`. Normally this would be `ResultHit`. Below is an example of adding an additional field in Hit in the schema

```javascript
    type ResultHit implements SKHit {
      id: ID!
      fields: ResultFields
      exampleCustomField: String   // example field addition
    }
```

[see an example](https://github.com/searchkit/searchkit/blob/next/examples/next/pages/api/graphql.js#L79)

Then provide a resolver for the field. See [ResultsResolver](https://github.com/beepsoft/searchkit/blob/next/packages/searchkit-schema/src/resolvers/HitsResolver.ts#L44) for what can be provided.

```javascript
  resolvers: withSearchkitResolvers({
    ResultHit: {
      exampleCustomField: ({
        id, // id contents
        rawHit // the raw ES hit contents
        }) => `Example Return Value for ${id}`
    }
  }),
```

[see an example](https://github.com/searchkit/searchkit/blob/next/examples/next/pages/api/graphql.js#L96)

then with a GQL query like below

```gql
query {
  results {
    hits {
      items {
        ... on ResultHit {
          id
          exampleCustomField
        }
      }
    }
  }
}
```

will call the exampleCustomField resolver for each hit item. The parent object (passed as an argument) contains the HitFields values. The return value is what will be provided in the response.

```
{
  "data": {
    "results": {
      "hits": {
        "items": [
          {
            "id": "tt0111161",
            "exampleCustomField": "Example Return Value for tt0111161"
          }
        ]
      }
    }
  }
}
```
