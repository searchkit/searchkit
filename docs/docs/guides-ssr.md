---
id: guides-ssr
title: Server side rendering
sidebar_label: Server side rendering
slug: /guides/ssr-server-side-rendering
---


### Configure Apollo Client for SSR
Searchkit is able to do server side rendering with a few changes. Due to elastic-ui isn't SSR friendly, you will need to build your own components to do SSR. The first part is to configure apollo to be able to SSR. See [Apollo Server side rendering guide](https://www.apollographql.com/docs/react/performance/server-side-rendering/). Take note on the uri, you will need it to be an absolute path instead of a relative path.

### Searchkit Routing Configuration
Then you must enable [url synchronization](https://www.searchkit.co/docs/guides/url-synchronization).

An example of the configuration can be seen below. You can see it in [action here](https://demo.searchkit.co/ssr-example?query=test)

### SEO
See [SEO tips](https://www.searchkit.co/docs/guides/seo-tips) for more information on how SSR and other features can improve SEO on your search.

### Example
```jsx
import { useQuery, gql } from '@apollo/client'
import { withSearchkit, useSearchkitVariables, withSearchkitRouting } from '@searchkit/client'
import withApollo from '../hocs/withApollo'
import { getDataFromTree } from "@apollo/client/react/ssr";

const Search = () => {
  const query = gql`
  query resultSet($query: String) {
    results(query: $query) {
      summary {
        total
      }
      hits {
        page {
          total
          totalPages
          pageNumber
          from
          size
        }
        sortedBy
        items {
          ... on ResultHit {
            id
            fields {
              title
              writers
              actors
              plot
              poster
            }
          }
        }
      }
    }
  }
`
const variables = useSearchkitVariables()
const { previousData, data = previousData, loading } = useQuery(QUERY, { variables })

  if (data) // return the result only once data has been returned
    return (
      <div>
        <h2>{data?.results?.summary?.total} Results</h2>
        {data.results?.hits.items.map((hit) => {
          return (
            <div key={hit.id}>
              <h4>{hit.fields.title}</h4>
              <p>{hit.fields.plot}</p>
            </div>
          )
        })}
      </div>
    )
  else {
    return null
  }
}

export default withApollo(withSearchkit(withSearchkitRouting(Search)), { getDataFromTree })
```