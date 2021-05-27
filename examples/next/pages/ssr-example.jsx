import { useQuery, gql } from '@apollo/client'
import { withSearchkit, useSearchkitVariables, withSearchkitRouting, useSearchkitQueryValue, useSearchkit } from '@searchkit/client'
import withApollo from '../hocs/withApollo'
import { getDataFromTree } from "@apollo/client/react/ssr"

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
const { previousData, data = previousData } = useQuery(query, {
  variables: variables
})
  if (data)
    return (
      <div>
        <h2>{data?.results?.summary?.total} Results</h2>
        <SearchBar/>
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
