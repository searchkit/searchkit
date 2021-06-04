---
id: own-components-ui-pagination
title: Pagination
sidebar_label: Pagination
slug: /build-your-own-components/pagination
---

To allow the user to navigate between pages of results.

### GraphQL query

Key points:
- Notice the page input values. `From` specifies the start and `size` is the number of hits to bring back. Page 1 of 10 hits would be `{ from: 0, size: 10 }`, page 2 of 10 hits would be `{ from: 10, size: 10 }`

```graphql
  {
    results(query: "test", page: {from: 0, size: 10}) {
      hits {
        page {
          total
          totalPages
          pageNumber
          from
          size
        }
      }
    }
  }
}
```

`@searchkit/client` will provide these variables via the `$page` variable so your usage would look like this

```jsx
  const query = gql`
  {
    results(query: $query, page: $page) {
      hits {
        page {
          total
          totalPages
          pageNumber
          from
          size
        }
      }
    }
  }
  `

  const variables = useSearchkitVariables()
  const { previousData, data = previousData, loading } = useQuery(query, { variables })
```

and to update the page, you would use searchkit client API `setPage`

### React Component

[Searchkit's Pagination Component](https://github.com/searchkit/searchkit/blob/next/packages/searchkit-elastic-ui/src/Pagination/index.tsx)

key points:
- Use `PaginationLink` React component. This will provide both href url (if routing has been switched on) / onClick handler to change page. See [PaginationLink API documentation](https://searchkit.co/docs/reference/searchkit-client#paginationlink-component) for more information.
- useSearchkit hook to get the searchkit's instance from the provider and then call `setPage` and `search` functions to update the page and execute a new search. `setQuery` method will reset the pagination and filters when invoked.

Below is an example component for Search query.

```jsx
const Pagination = ({ data }) => {
  const api = useSearchkit()

  return (
    <PaginationUIComponent
      pageCount={data?.hits.page.totalPages}
      activePage={data?.hits.page.pageNumber}
      onPageClick={(activePage) => {
        api.setPage({ size: data.hits.page.size, from: activePage * data.hits.page.size })
        api.search()
      }}
    />
  )
}

```