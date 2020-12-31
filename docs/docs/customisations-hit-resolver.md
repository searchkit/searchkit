---
id: customisations-hit-resolver
title: Extending Result Hits
sidebar_label: Extending Result Hits
slug: /customisations/extending-hit-result
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

Then provide a resolver for the field. 

```javascript
  resolvers: withSearchkitResolvers({
    ResultHit: {
      exampleCustomField: (parent) => `Example Return Value for ${parent.id}`
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