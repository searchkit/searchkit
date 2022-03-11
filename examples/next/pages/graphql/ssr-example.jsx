import { useQuery, gql } from '@apollo/client'
import { withSearchkit, useSearchkitVariables, withSearchkitRouting, useSearchkitQueryValue, useSearchkit, FilterLink, PaginationLink } from '@searchkit/client'
import withApollo from '../../hocs/withApollo'
import { getDataFromTree } from "@apollo/client/react/ssr"
import Link from 'next/link'

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
  query resultSet($query: String, $filters: [SKFiltersSet], $page: SKPageInput, $sortBy: String) {
    results(query: $query, filters: $filters) {
      summary {
        total
      }
      hits(page: $page, sortBy: $sortBy) {
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
  variables
})
  return (
    <div>
      <h2>{data?.results?.summary?.total} Results</h2>
      <Link href="/simple-page">Link to a new page</Link>
      <FilterLink filter={{identifier: 'type', value:'movie'}}>Toggle Filter by Movie</FilterLink>
      <SearchBar/>
      {data.results?.hits.items.map((hit) => {
        return (
          <div key={hit.id}>
            <h4>{hit.fields.title}</h4>
            <p>{hit.fields.plot}</p>
          </div>
        )
      })}
      <PaginationLink page={1}>Page 1</PaginationLink>
      <PaginationLink page={2}>Page 2</PaginationLink>
    </div>
  )
}

export default withApollo(withSearchkit(withSearchkitRouting(Search)), { getDataFromTree })