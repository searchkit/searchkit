// import gql from 'graphql-tag'
// import withApollo from '../lib/withApollo'
// import {
//   SearchInput,
//   Hits,
//   RefinementFacet,
//   SelectedFilters,
//   FacetsHelper,
//   useSearchkitQuery
// } from '../components/Searchkit'
// import withSearchkit from '../lib/withSearchkit'

// const FacetsContainer = FacetsHelper([RefinementFacet])

// const Index = () => {
//   const query = gql`
//     query resultSet($query: String, $filters: [FiltersSet]) {
//       results(query: $query, filters: $filters) {
//         summary {
//           total
//         }
//         hits {
//           id
//           fields {
//             title
//           }
//         }
//         facets {
//           id
//           ...RefinementFacetFragment
//         }
//       }
//     }
//     ${RefinementFacet.Fragment}
//   `

//   const { data } = useSearchkitQuery(query)

//   return (
//     <div>
//       <SearchInput />
//       <SelectedFilters />
//       <FacetsContainer data={data?.results} />
//       <Hits data={data?.results} />
//     </div>
//   )
// }

// export default withApollo(withSearchkit(Index))

import React from 'react'

// import Resolvers from '@searchkit/client'
export default () => <div>hello world</div>
