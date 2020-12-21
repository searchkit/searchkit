---
id: ui-setup-eui
title: With EUI Components
sidebar_label: With EUI Components
slug: /quick-start/ui/eui
---

This guide will step you through how to use the out-of-the-box Searchkit UI components. We will be using Next JS. Also see [Create React App](https://searchkit.co/docs/examples/create-react-app) if you're not using NextJS.

Once you've completed the [initial setup](../initial-setup), start by adding the @searchkit/elastic-ui and @elastic/eui dependency via yarn

```yarn add @searchkit/elastic-ui @elastic/eui```

NextJS (if you have been following the guide with NextJS) has an issue with EUI and SSR so we are going to [dynamically import](https://nextjs.org/docs/advanced-features/dynamic-import) the component.

First create a JS file called search.js in the components folder which will be the search page.

The search page will contain the following:
- components from searchkit client, elastic-ui and elastic's EUI
- A GQL query using all fields required by searchkit's components

Below is an example of a typical Searchkit page which uses EUI and Searchkit EUI. 

```javascript
# components/search.js

import { useSearchkitQuery } from '@searchkit/client'
import { gql } from '@apollo/client'

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
  EuiFlexGroup,
  EuiFlexItem
} from '@elastic/eui'

const query = gql`
  query resultSet($query: String, $filters: [FiltersSet], $page: PageInput) {
    results(query: $query, filters: $filters) {
      summary {
        total
        appliedFilters {
          identifier
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
          }
        }
      }
      facets {
        identifier
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

then go to the pages/index.js and update

```javascript
import { withSearchkit } from "@searchkit/client";
import withApollo from "../lib/withApollo";
import dynamic from 'next/dynamic'
const Search = dynamic(
  () => import('../components/Search'),
  { ssr: false }
)


const Index = () => {
  return <Search />
}

export default withApollo(withSearchkit(Index));
```
and add EUI CSS globally via adding the css file to pages/_app.js

```
import '@elastic/eui/dist/eui_theme_light.css'

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp
```
