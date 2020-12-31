---
id: customisations-ui-facet-display
title: Controlling UI for Facet
sidebar_label: Controlling Facet UI
slug: /customisations/facet-ui-display
---

For each facet in the configuration, there is a field called display. 

```javascript
    new RefinementSelectFacet({
      field: 'colour.raw',
      identifier: 'colour',
      label: 'Colour',
      display: 'ColourPickerFacet'
    })
```

Display field is used to indicate what presentation should be for facet within the UI.  

```gql
{
  results(query: "heat") {
    facets {
      identifier
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

### Elastic UI Components

If you're using @searchkit/elastic-ui, create a react component to be used for the facet

```javascript
import React from 'react'
import { EuiTitle } from '@elastic/eui'
import { useSearchkit } from '@searchkit/client'

export const ColourPickerFacet = ({ facet, loading }) => {
  const api = useSearchkit()

  const entries = facet.entries.map((entry) => (
    <li
      style={{ backgroundColor: entry, border: api.isFilterSelected({ identifier: facet.identifier, value: entry.label }) ? '1px solid red' : none }}
      onClick={() => {
        api.toggleFilter({ identifier: facet.identifier, value: entry.label })
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