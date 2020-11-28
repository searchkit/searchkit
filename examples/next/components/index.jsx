import { useSearchkitQuery } from '@searchkit/client'
import { gql } from '@apollo/client'
import { HitsList, HitsGrid } from './searchkit/Hits'
import {
  FacetsList,
  SearchBar,
  Pagination,
  ResetSearchButton,
  SelectedFilters,
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
  EuiFlexItem
} from '@elastic/eui'

const query = gql`
  query resultSet($query: String, $filters: [FiltersSet], $page: PageInput, $sortBy: String) {
    results(query: $query, filters: $filters) {
      summary {
        total
        appliedFilters {
          id
          label
          value
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

import { useSearchkit } from '@searchkit/client'
import { EuiSuperSelect } from '@elastic/eui'
import React, { useState, useEffect } from 'react'

export const SortingSelector = ({ data, loading }) => {
  const api = useSearchkit()
  const [value, setValue] = useState("")
  const [options, setOptions] = useState([])

  useEffect(() => {
    const selectedOptionId = data?.hits.sortedBy
    setValue(selectedOptionId)
  }, [data?.hits.sortedBy])

  useEffect(() => {
    const options = data?.summary?.sortOptions?.map((sortOption) => ({
      value: sortOption.id,
      inputDisplay: sortOption.label
    })) || []
    setOptions(options)
  }, [data?.summary?.sortOptions])

  return (
    <EuiSuperSelect
      options={options}
      valueOfSelected={value}
      onChange={(value) => {
        api.setSortBy(value)
        api.search()
      }}
    />
  )
}


const Page = () => {
  const { data, loading } = useSearchkitQuery(query)
  const [viewType, setViewType] = useState('list')
  const Facets = FacetsList([])
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
              <EuiFlexGroup>
                <EuiFlexItem grow={1}>
                  <SortingSelector data={data?.results} />
                </EuiFlexItem>
                <EuiFlexItem grow={2}>
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
                </EuiFlexItem>
              </EuiFlexGroup>
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

export default Page
