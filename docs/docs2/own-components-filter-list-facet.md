---
id: own-components-value-facet
title: Value Filter Facet
sidebar_label: Value Filter Facet
slug: /build-your-own-components/value-filter-facet
---

The Value Filter facet is used to create a navigation based on options available in one field. Allows the user to drill down to content by selecting one or more filters

### Indexing Requirements
The objects to use in the hierarchical menu must follow this structure:

```json
[{
  "id": "13452677150950907",
  "name": "Unstructured Double-Breasted Linen Blazer",
  "category": "Clothing"
},
{
  "id": "11452292647194357",
  "name": "Nike Tick Logo T-Shirt",
  "category": "Sports"
},
{
  "id": "560971904241887",
  "name": "Belutti Loafers",
  "category": "Shoes"
}]
```

with `category` being an Elasticsearch field mapping type of `keyword`.

### API Configuration

```javascript

import {
  RefinementSelectFacet
} from '@searchkit/schema'

const searchkitConfig = {
  facets: [
    new RefinementSelectFacet({
      field: 'categories', // keyword type field
      identifier: 'categories',
      label: 'Categories',
      display: 'ListFacet',
      multipleSelect: true // User can choose multiple filters to expand search
    })
  ]
}

```
#### Options

| Option        | Description      |
| :------------- | :----------- |
| field         | Aggregation field to be used, a field that is type `keyword`   |
| identifier             | Required to be unique. Used to apply filters on field |
| label          | UI label for facet. Returned in API |
| display        | **Optional**. Used on UI to specify what component to handle facet. Returned in API |

### GraphQL Query
You can use GraphQL summary node to provide you what filters have been applied and the search query. list below is all possible values that summary node provides and with graphQL, you can specify what fields you need.

Key points:
* Notice how the filters are applied with the level property added.
* Within facets, entries can return sub entries for hierarchical facets when they are selected. The GQL example supports up to 3 levels but you can add more sub levels, depending on how many sub category fields you have

```graphql
  results(query: "test", filters: [
    { identifier: 'categories', value: "Clothing" }
  ]) {
    summary {
      total
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
    facets {
      identifier
      label
      facets {
        identifier
        type
        label
        display
        entries {
          label
          count
        }
      }
    }
  }
}
```

### Searchkit UI Component

If you use the FacetList component, the component should work out the box.

### Writing your own component

Key points:
- Use `FilterLink` React component. This will provide both href url (if routing has been switched on) / onClick handler to remove the filter. See [FilterLink API documentation](https://searchkit.co/docs/reference/searchkit-client#filterlink-component) for more information. 

#### Basic Example
```jsx
export const ColourPickerFacet = ({ facet, loading }) => {
  const api = useSearchkit()

  const entries = facet.entries.map((entry) => (
    <li
      style={{ backgroundColor: entry, border: api.isFilterSelected({ identifier: facet.identifier, value: entry.label }) ? '1px solid red' : none }}
    >
      <FilterLink filter={{ identifier: facet.identifier, value: entry.label }}>
        {entry}
      </FilterLink>
    </li>
  ))

  return (
    <>
      <EuiTitle size="xxs">
        <h3>{facet.label}</h3>
      </EuiTitle>
      <ul>{entries}</ul>
    </>
  )
}
```
