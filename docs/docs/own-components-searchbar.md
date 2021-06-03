---
id: own-components-ui-search-query
title: Custom UI Facet
sidebar_label: Search Query
slug: /build-your-own-components/search-query
---

The component which allows your user to specify a text based query.

### Writing the component

Two key points:
- useSearchkitQueryValue provides an API like `useState` hook but listens to changes to the query within searchkit instance. For example, if the customer navigated back and the query was updated to a previous value, the hook will update automatically.
- useSearchkit hook to get the searchkit's instance from the provider and then call `setQuery` and `search` functions to update the query and execute a new search. `setQuery` method will reset the pagination and filters when invoked.

Below is an example component for Search query.

```jsx
import { useSearchkitQueryValue, useSearchkit } from '@searchkit/client'

function SearchBar() {
  const [query, setQuery] = useSearchkitQueryValue();
  const api = useSearchkit()
  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      api.setQuery(query)
      api.search()
    }}>
      <input
        type="search"
        value={query}
        onChange={(e) => {
          const value = e.target.value
          setQuery(value)
        }}
      />
    </form>
  )
}
```