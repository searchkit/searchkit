import { useSearchkitVariables } from '@searchkit/client'
import { gql, useQuery } from '@apollo/client'
import { useState } from 'react'
import {
  FacetsList,
  SearchBar,
  Pagination,
  ResetSearchButton,
  SelectedFilters,
  SortingSelector
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
  EuiButtonGroup,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFlexGrid,
  EuiCard
} from '@elastic/eui'

const query = gql`
  query resultSet($query: String, $filters: [SKFiltersSet], $page: SKPageInput, $sortBy: String) {
    products(query: $query, filters: $filters) {
      summary {
        total
        appliedFilters {
          id
          identifier
          display
          label
          ... on HierarchicalValueSelectedFilter {
            level
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
          ... on ProductHit {
            id
            fields {
              imageURL
              designerName
              name
              price
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
`

const HitsGrid = ({ data }) => (
  <EuiFlexGrid gutterSize="l">
    {data?.products.hits.items.map((hit) => (
      <EuiFlexItem key={hit.id} grow={2}>
        <EuiCard
          grow={false}
          textAlign="left"
          image={<img src={hit.fields.imageURL} style={{ maxWidth: 200 }} />}
          title={hit.fields.name}
          description={hit.fields.brandName}
        />
      </EuiFlexItem>
    ))}
  </EuiFlexGrid>
)

const Page = () => {
  const variables = useSearchkitVariables()
  const { previousData, data = previousData, loading } = useQuery(query, { variables })
  const [viewType, setViewType] = useState('list')
  const Facets = FacetsList([])
  return (
    <EuiPage>
      <EuiPageSideBar>
        <SearchBar loading={loading} />
        <EuiHorizontalRule margin="m" />
        <Facets data={data?.products} loading={loading} />
      </EuiPageSideBar>
      <EuiPageBody component="div">
        <EuiPageHeader>
          <EuiPageHeaderSection>
            <EuiTitle size="l">
              <SelectedFilters data={data?.products} loading={loading} />
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
                <h2>{data?.products.summary.total} Results</h2>
              </EuiTitle>
            </EuiPageContentHeaderSection>
            <EuiPageContentHeaderSection>
              <EuiFlexGroup>
                <EuiFlexItem grow={1}>
                  <SortingSelector data={data?.products} loading={loading} />
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiPageContentHeaderSection>
          </EuiPageContentHeader>
          <EuiPageContentBody>
            <HitsGrid data={data} />
            <EuiFlexGroup justifyContent="spaceAround">
              <Pagination data={data?.results} />
            </EuiFlexGroup>
          </EuiPageContentBody>
        </EuiPageContent>
      </EuiPageBody>
    </EuiPage>
  )
}

export default Page
