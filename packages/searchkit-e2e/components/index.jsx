import { useSearchkitQuery } from '@searchkit/client'
import { gql } from '@apollo/client'

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
  EuiTitle
} from '@elastic/eui'

export default () => {
  const query = gql`
    query resultSet($query: String, $filters: [FiltersSet]) {
      results(query: $query, filters: $filters) {
        summary {
          total
        }
        hits {
          id
          fields {
            title
          }
        }
        facets {
          id
          type
          label
          entries {
            id
            label
            count
          }
        }
      }
    }
  `

  const { data } = useSearchkitQuery(query)
  return (
    <EuiPage>
      <EuiPageSideBar>SideBar nav</EuiPageSideBar>
      <EuiPageBody component="div">
        <EuiPageHeader>
          <EuiPageHeaderSection>
            <EuiTitle size="l">
              <h1>Page title</h1>
            </EuiTitle>
          </EuiPageHeaderSection>
          <EuiPageHeaderSection>Page abilities</EuiPageHeaderSection>
        </EuiPageHeader>
        <EuiPageContent>
          <EuiPageContentHeader>
            <EuiPageContentHeaderSection>
              <EuiTitle>
                <h2>Content title</h2>
              </EuiTitle>
            </EuiPageContentHeaderSection>
            <EuiPageContentHeaderSection>Content abilities</EuiPageContentHeaderSection>
          </EuiPageContentHeader>
          <EuiPageContentBody>Content body</EuiPageContentBody>
        </EuiPageContent>
      </EuiPageBody>
    </EuiPage>
  )
}
