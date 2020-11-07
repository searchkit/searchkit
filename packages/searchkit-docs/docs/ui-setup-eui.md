---
id: ui-setup-eui
title: With EUI Components
sidebar_label: With EUI Components
slug: /quick-start/ui/eui
---

This guide will step you through how to use the out the box searchkit UI components. Once you've completed the [initial setup](../initial-setup), start by adding the @searchkit/elastic-ui and @elastic/eui dependency via yarn

```yarn add @searchkit/elastic-ui @elastic/eui```

Next (if you have been following the guide with NextJS) go to pages/index.js and:
- import the components from searchkit and EUI
- Update the GQL query to include all fields required by searchkit's components
- Add Searchkit components to the page

Below is an example of a typical Searchkit page which uses EUI and searchkit EUI. 

```javascript

import {
  FacetsList,
  SearchBar,
  Pagination,
  ResetSearchButton,
  SelectedFilters
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
  EuiFlexGroup
} from '@elastic/eui'

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

export const HitsList = ({ data }) => (
  <>
    {data?.results.hits.items.map((hit) => (
      <EuiFlexGroup gutterSize="xl" key={hit.id}>
        <EuiFlexItem>
          <EuiFlexGroup>
            <EuiFlexItem grow={4}>
              <EuiTitle size="xs">
                <h6>{hit.id}</h6>
              </EuiTitle>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlexItem>
      </EuiFlexGroup>
    ))}
  </>
)

export default () => {

  const { data, loading } = useSearchkitQuery(query)
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
          </EuiPageContentHeader>
          <EuiPageContentBody>
            <HitsList data={data} />
            <EuiFlexGroup justifyContent="spaceAround">
              <Pagination data={data?.results} />
            </EuiFlexGroup>
          </EuiPageContentBody>
        </EuiPageContent>
      </EuiPageBody>
    </EuiPage>
  )
}
```
