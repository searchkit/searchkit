import { useSearchkitVariables } from '@searchkit/client'
import { gql, useQuery } from '@apollo/client'
import PlacesSearchInput from './Input'
import Maps from './maps'

import {
  Pagination,
  ResetSearchButton,
  SelectedFilters,
  FacetsList
} from '@searchkit/elastic-ui'

import {
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentBody,
  EuiPageContentHeader,
  EuiPageContentHeaderSection,
  EuiPageHeader,
  EuiPageHeaderSection,
  EuiPageSideBar,
  EuiTitle,
  EuiHorizontalRule,
  EuiText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFlexGrid
} from '@elastic/eui'

const query = gql`
  query resultSet($query: String, $filters: [SKFiltersSet], $page: SKPageInput, $sortBy: String) {
    usParks(query: $query, filters: $filters) {
      summary {
        total
        appliedFilters {
          id
          identifier
          display
          label
          ... on DateRangeSelectedFilter {
            dateMin
            dateMax
          }
          ... on NumericRangeSelectedFilter {
            min
            max
          }
          ... on ValueSelectedFilter {
            value
          }
        }
        sortOptions {
          id
          label
        }
        query
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
          ... on ParkResultHit {
            id
            fields {
              title
              location
              nps_link
              states
              description
            }
          }
        }
      }
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
`

export const HitsList = ({ data }) => (
  <EuiFlexGrid direction="column">
    {data?.hits.items.map((hit) => (
      <EuiFlexItem key={hit.id}>
      <EuiFlexGroup gutterSize="xl" >
        <EuiFlexItem>
          <EuiFlexGroup>
            <EuiFlexItem grow={4}>
              <EuiTitle size="xs">
                <a href={hit.fields.nps_link}><h6>{hit.fields.title} ({hit.fields.states.join(", ")})</h6></a>
              </EuiTitle>
              <EuiText>
                <p>{hit.fields.description}</p>
              </EuiText>
              <EuiText>
              <a href={hit.fields.nps_link}>Read more »</a>
              </EuiText>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlexItem>
    </EuiFlexGroup>
    </EuiFlexItem>
    ))}
  </EuiFlexGrid>
)

const LocationFilter = ({ filter, loading }) => {
  return null
}

const Page = () => {
  const variables = useSearchkitVariables()
  const { previousData, data = previousData, loading } = useQuery(query, { variables })
  const Facets = FacetsList()
  return (
    <EuiPage>
      <EuiPageSideBar>
        <PlacesSearchInput />
        <EuiHorizontalRule margin="m" />
        <Facets data={data?.usParks} />
      </EuiPageSideBar>
      <EuiPageBody component="div">
        <EuiPageHeader>
          <EuiPageHeaderSection>
            <EuiTitle size="l">
              <SelectedFilters data={data?.usParks} loading={loading} customFilterComponents={{
                GeoBoundingBoxFilter: LocationFilter
              }} />
            </EuiTitle>
          </EuiPageHeaderSection>
          <EuiPageHeaderSection>
            <ResetSearchButton loading={loading} />
          </EuiPageHeaderSection>
        </EuiPageHeader>
        <EuiPageContent>
          <EuiPageContentHeader>
            <EuiPageContentHeaderSection>
              <EuiTitle size="s">
                <h2>{data?.usParks.summary.total} Results</h2>
              </EuiTitle>
            </EuiPageContentHeaderSection>
          </EuiPageContentHeader>
          <EuiPageContentBody>
          <EuiFlexGroup>
            <EuiFlexItem>
              <HitsList data={data?.usParks} />
              <EuiFlexGroup justifyContent="spaceAround">
                <Pagination data={data?.usParks} />
              </EuiFlexGroup>
            </EuiFlexItem>
            <EuiFlexItem>
              <Maps data={data?.usParks} />
            </EuiFlexItem>
          </EuiFlexGroup>
          </EuiPageContentBody>
        </EuiPageContent>
      </EuiPageBody>
    </EuiPage>
  )
}

export default Page
