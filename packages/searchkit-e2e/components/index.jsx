import { useSearchkitQuery } from '@searchkit/client'
import { gql } from '@apollo/client'
import { FacetsContainer } from './searchkit/facets/FacetsContainer'
import { SearchBar } from './searchkit/SearchBar'
import { SelectedFilters } from './searchkit/SelectedFilters'
import { HitsList, HitsGrid } from './searchkit/Hits'
import { ResetSearchButton } from './searchkit/ResetSearchButton'
import { Pagination } from './searchkit/Pagination'

import React, { useState } from 'react'

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
  EuiFlexGroup
} from '@elastic/eui'

export default () => {
  const query = gql`
    query resultSet($query: String, $filters: [FiltersSet], $page: PageInput) {
      results(query: $query, filters: $filters) {
        summary {
          total
          appliedFilters {
            id
            label
            value
          }
          query
        }
        hits(page: $page) {
          page {
            total
            totalPages
            pageNumber
            from
            size
          }
          items {
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
        facets {
          id
          type
          label
          display
          entries {
            id
            label
            count
          }
        }
      }
    }
  `

  const { data, loading } = useSearchkitQuery(query)
  const [viewType, setViewType] = useState('list')
  const Facets = FacetsContainer([])
  return (
    <EuiPage>
      <EuiPageSideBar>
        <SearchBar loading={loading} />
        <EuiHorizontalRule margin="m" />
        <Facets data={data?.results} loading={loading} />
      </EuiPageSideBar>
      <EuiPageBody component="div">
        <EuiPageHeader>
          <EuiPageHeaderSection>
            <EuiTitle size="l">
              <SelectedFilters data={data?.results} loading={loading} />
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
                <h2>{data?.results.summary.total} Results</h2>
              </EuiTitle>
            </EuiPageContentHeaderSection>
            <EuiPageContentHeaderSection>
              <EuiButtonGroup
                options={[
                  {
                    id: `grid`,
                    label: 'Grid'
                  },
                  {
                    id: `list`,
                    label: 'List'
                  }
                ]}
                idSelected={viewType}
                onChange={(id) => setViewType(id)}
              />
            </EuiPageContentHeaderSection>
          </EuiPageContentHeader>
          <EuiPageContentBody>
            {viewType === 'grid' ? <HitsGrid data={data} /> : <HitsList data={data} />}
            <EuiFlexGroup justifyContent="spaceAround">
              <Pagination data={data?.results} />
            </EuiFlexGroup>
          </EuiPageContentBody>
        </EuiPageContent>
      </EuiPageBody>
    </EuiPage>
  )
}
