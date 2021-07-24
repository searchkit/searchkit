---
id: own-components-hierarchical-facet
title: Hierarchical Facet
sidebar_label: Hierarchical Facet
slug: /build-your-own-components/hierarchical-facet
---

The Hierarchical Menu facet is used to create a navigation based on a hierarchy of facet fields. It is commonly used for categories with subcategories.

### Indexing Requirements
The objects to use in the hierarchical menu must follow this structure:

```json
[{
  "id": "13452677150950907",
  "name": "Unstructured Double-Breasted Linen Blazer",
  "category_lvl1": "Clothing",
  "category_lvl2": "Blazers",
  "category_lvl3": "Double breasted blazers"
},
{
  "id": "11452292647194357",
  "name": "G9 Checked Linen and Lyocell-Blend Harrington Jacket",
  "category_lvl1": "Clothing",
  "category_lvl2": "Coats and Jackets",
  "category_lvl3": "Bomber jackets"
},
{
  "id": "560971904241887",
  "name": "Logo-Flocked Cotton-Jersey T-Shirt",
  "category_lvl1": "Clothing",
  "category_lvl2": "T-Shirts",
  "category_lvl3": "Printed t-shirts"
}]
```

### API Configuration

```javascript

const searchkitConfig = {
  facets: [
    new HierarchicalMenuFacet({
      fields: [ 'category_lvl1.keyword', 'category_lvl2.keyword', 'category_lvl3.keyword' ],
      label: 'Category',
      identifier: 'category'
    })
  ]
}

```
#### Options

| Option        | Description      |
| :------------- | :----------- |
| fields         | Array of Aggregation fields to be used, preferably a field that is raw, not tokenized. Ordered in the array in their hierarchy.   |
| identifier             | Required to be unique. Used to apply filters on field |
| label          | UI label for facet. Used by @searchkit/elastic-ui components |
| display        | **Optional**. Used on UI to specify what component to handle facet |

### GraphQL Query
You can use GraphQL summary node to provide you what filters have been applied and the search query. list below is all possible values that summary node provides and with graphQL, you can specify what fields you need.

Key points:
* Notice how the filters are applied with the level property added.
* Within facets, entries can return sub entries for hierarchical facets when they are selected. The GQL example supports up to 3 levels but you can add more sub levels, depending on how many sub category fields you have

```graphql
  results(query: "test", filters: [
    { identifier: 'category', value: "Clothing", level: 1 },
    { identifier: 'category', value: "T-Shirts", level: 2 },

  ]) {
    summary {
      total
      appliedFilters {
        id
        identifier
        label
        display
        ... on HierarchicalValueSelectedFilter {
          level
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
          level
          entries {
            label
            count
            level
            entries {
              label
              count
              level
            }
          }
        }
      }
    }
  }
}
```

### Searchkit UI Component

If you use the FacetList component, the hierarchical component should work out the box.

### Writing your own component

Key points:
- Use `FilterLink` React component. This will provide both href url (if routing has been switched on) / onClick handler to remove the filter. See [FilterLink API documentation](https://searchkit.co/docs/reference/searchkit-client#filterlink-component) for more information. 

#### Basic Example
```jsx
const EntriesList = ({ entries, loading, facet }) => {
  const api = useSearchkit()
  const entriesElements = entries.map((entry) => {
    const selected = api.isFilterSelected({ identifier: facet.identifier, value: entry.label, level: entry.level })
    return (
      <li key={entry.label}>
        >
          <FilterLink filter={{ identifier: facet.identifier, value: entry.label, level: entry.level }} >
            <span style={{'font-weight': selected ? 'bold' : 'normal'}}>
              {entry.label} ({entry.count})
            </span>
          </FilterLink>
        <ul style={{marginLeft: "10px"}}>
          { entry.entries && <EntriesList entries={entry.entries} loading={loading} facet={facet} /> }
        </ul>
      </li>
    )
    })
  return (
    <ul>{entriesElements}</ul>
  )

}

export const HierarchicalMenuFacet = ({ facet, loading }) => {
  return (
    <>
      <h3>{facet.label}</h3>
      <EntriesList entries={facet.entries} facet={facet} loading={loading} />
    </>
  )
}
```
