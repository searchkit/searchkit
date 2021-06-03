---
id: own-components-ui-result-list-hits
title: Results List
sidebar_label: Results List
slug: /build-your-own-components/result-list-hits
---

The component which will render the search results to the page

### Data Requirements
On API setup, you need to specify the fields you want by implementing the HitFields type

```
    type HitFields {
      title: String
      writers: [String]
      actors: [String]
      plot: String
      poster: String
    }
```

Once configured, you should be able to query and bring back the values for those fields within the graphQL query. 

```graphql
{
  results(filters: []) {
    hits {
      items {
        ... on ResultHit {
          id
          fields {
            title
            writers
            actors
            poster
          }
        }
      }
    }
  }
}
```

You dont need to declare them all, only the fields you are using for your search result. For example, you may have two different views that have different data requirements. GraphQL allows you to return only the values you need.

The next step is a simple case of displaying these items with a React component.

```jsx
function Results({ data }) => {
  return (
    <div className="results">
      {data.results.hits.items.map((item) => {
        return (
          <div>id: {item.id}, title: {item.fields.title}</div>
        )
      })}
    </div>
  )
}

```

### Data from different sources other than elasticsearch
You can add your own custom resolvers and types to the schema. A resolver can recieve the rawHit ES response for example, using a field value to call your DB about stock availability.

```javascript
  resolvers: withSearchkitResolvers({
    ResultHit: {
      stock: async ({ id, rawHit }) => {
        const sizesAvailable = await StockService.getById(id)
        return sizesAvailable
      }
    }
  })
```

```graphql
{
  results(filters: []) {
    hits {
      items {
        ... on ResultHit {
          id
          fields {
            title
          }
          stock {
            id
            label
            quantity
          }
        }
      }
    }
  }
}
```

See [Extending Results hits guide](https://searchkit.co/docs/customisations/extending-hit-result) for more information.



