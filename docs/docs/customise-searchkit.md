---
id: customise-searchkit
title: Customise Searchkit
sidebar_label: Customise Searchkit
slug: /quick-start/customise-searchkit
---

## Customise Hits via a Resolver

1. Add to the schema and extend the hit type. Below is an example of adding an additional field in Hit in the schema

```javascript
    extend type Hit {
      exampleCustomField: String
    }
```

[see an example](https://github.com/searchkit/searchkit/blob/next/examples/next/pages/api/graphql.js#L79)

Then provide a resolver for the field. 

```javascript
  resolvers: {
    ...SearchkitResolvers(searchkitConfig)
    Hit: {
       exampleCustomField: (parent) => `Example Returm Value for ${parent.id}`
    }
  },
```

[see an example](https://github.com/searchkit/searchkit/blob/next/examples/next/pages/api/graphql.js#L96)

then with a GQL query like below

```gql
  query {
    results() {
      hits {
        items {
          id
          exampleCustomField
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

## Custom UI for Facets
For each facet in the configuration, there is a field called display. 

```javascript
    new RefinementSelectFacet({
      field: 'colour.raw',
      id: 'colour',
      label: 'Colour',
      display: 'ColourPickerFacet'
    })
```

Display field is used to indicate what presentation should be for facet within the UI.  

```gql
{
  results(query: "heat") {
    facets {
      id
      label
      type
      display
      entries {
        id
        label
        count
      }
    }
  }
}
```

If you're using @searchkit/elastic-ui, create a react component to be used for the facet

```javascript
import React from 'react'
import { EuiTitle } from '@elastic/eui'
import { useSearchkit } from '@searchkit/client'

export const ColourPickerFacet = ({ facet, loading }) => {
  const api = useSearchkit()

  const entries = facet.entries.map((entry) => (
    <li
      style={{ backgroundColor: entry, border: api.isFilterSelected({ id: facet.id, value: entry.label }) ? '1px solid red' : none }}
      onClick={() => {
        api.toggleFilter({ id: facet.id, value: entry.label })
        api.search()
      }}
    >
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

ColourPickerFacet.DISPLAY = 'ColourPickerFacet'

```

Then add the facet to FacetsList

```javascript
  import { FacetsList } from "@searchkit/elastic-ui" 

  export default () => {
    const { data, loading } = useSearchkitQuery(query)
    const Facets = FacetsList([ColourPickerFacet])
    return (
      ...
        <Facets data={data?.results} loading={loading} />
      ...
    )
  } 
```
Facets component will render all the facets that come back, using the display field to map components with facet response. 

## Add Custom Facet

Create a Facet Class by implementing the BaseFacet interface.

```javascript
  import { BaseFacet } from "@searchkit/apollo-resolvers"

  export class CustomFacet implements BaseFacet {

    // whether Facet should exclude its own filters from 
    // aggregation query. 
    // When true, will return all aggregations for field 
    // negating its own facet filters
    // Example: for multiple select filters
    // you want to show all aggregations for field even 
    // when one filter was been chosen 
    excludeOwnFilters: false

    constructor(config) {
      this.config = config
    }
    
    // unique to facet
    getId() {
      return this.config.id
    }

    // return label for facet
    getLabel() {
      return this.config.label
    }

    // return the elasticsearch aggregation query for facet
    // overrides are values specified at query time
    // Facet options can be size or query
    getAggregation(overrides: FacetOptions) {

    }

    // transform the facet's  filters into ES filter queries
    getFilters(filters: Array<MixedFilter>) {
      
    }

    // transform ES response into an object that matches the Facet Schema type 
    transformResponse(response) {
      return {
        id: this.getId(),
        label: this.getLabel(),
        type: 'CustomFacet',
        display: 'listFacet',
        customField: "custom"
      }
    }

  }
```

Then add a Facet type to the schema

```gql
  type CustomFacet implements FacetSet {
    id: String
    label: String
    type: String
    display: String
    customField: String
  }
```

then you should be able to query for facet

```gql
  query {
    results {
    	facets {
        ... on RefinementSelectFacet {
          id
          label
          type
          display
          customField
        }
      }
    } 
  }
```