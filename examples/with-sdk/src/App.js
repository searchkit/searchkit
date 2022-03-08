import{ DateRangeFacet, MultiMatchQuery, RangeFacet, RefinementSelectFacet } from '@searchkit/sdk'
import { useState } from 'react';
import {
  FacetsList,
  SearchBar,
  ResetSearchButton,
  SelectedFilters,
  Pagination
} from '@searchkit/elastic-ui'

import {
  EuiPage,
  EuiFlexGrid,
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
  EuiCard
} from '@elastic/eui'

import '@elastic/eui/dist/eui_theme_light.css'
import useSearchkitSDK from './useSearchkitSDKHook';

const config = {
  host: "http://localhost:9200",
  index: "imdb_movies",
  hits: {
    fields: ["title"]
  },
  query: new MultiMatchQuery({ fields: ["title", "genres", "directors", "writers", "actors", "countries", "plot"] }),
  facets: [
    new RefinementSelectFacet({
      field: 'type',
      identifier: 'type',
      label: 'Type',
      multipleSelect: true
    }),
    new RangeFacet({
      field: 'metascore',
      identifier: 'metascore',
      label: 'Metascore',
      range: {
        min: 0,
        max: 100,
        interval: 5
      }
    }),
    new DateRangeFacet({
      field: 'released',
      identifier: 'released',
      label: 'Released'
    }),

    new RefinementSelectFacet({
      field: 'genres.keyword',
      identifier: 'genres',
      label: 'Genres',
      multipleSelect: true
    }),

    new RefinementSelectFacet({
      field: 'countries.keyword',
      identifier: 'countries',
      label: 'Countries'
    }),
    new RefinementSelectFacet({
      field: 'rated',
      identifier: 'rated',
      label: 'Rated',
      multipleSelect: true
    }),
    new RefinementSelectFacet({
      field: 'directors.keyword',
      identifier: 'directors',
      label: 'Directors'
    }),

    new RefinementSelectFacet({
      field: 'writers.keyword',
      identifier: 'writers',
      label: 'Writers'
    }),

    new RefinementSelectFacet({
      field: 'actors.keyword',
      identifier: 'actors',
      label: 'Actors',
      multipleSelect: true
    }),

    new RangeFacet({
      field: 'imdbrating',
      identifier: 'imdbrating',
      label: 'IMDB Rating',
      range: {
        interval: 1,
        max: 10,
        min: 1
      }
    })
  ]
}

const HitsGrid = ({ data }) => (
  <EuiFlexGrid gutterSize="l">
    {data?.hits.items.map((hit) => (
      <EuiFlexItem key={hit.id} grow={2}>
        <EuiCard
          textAlign="left"
          image={<img src={hit.fields.poster} style={{ maxWidth: 200 }} alt="Nature" />}
          title={hit.fields.title}
          description={hit.fields.plot}
        />
      </EuiFlexItem>
    ))}
  </EuiFlexGrid>
)

function App() {
  
  const Facets = FacetsList([])
  const { results, loading } = useSearchkitSDK(config)
  return (
    <EuiPage>
      <EuiPageSideBar>
        <SearchBar loading={loading} />
        <EuiHorizontalRule margin="m" />
        <Facets data={results} loading={loading} />
      </EuiPageSideBar>
      <EuiPageBody component="div">
        <EuiPageHeader>
          <EuiPageHeaderSection>
            <EuiTitle size="l">
              <SelectedFilters data={results} loading={loading} />
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
                <h2>{results?.summary.total} Results</h2>
              </EuiTitle>
            </EuiPageContentHeaderSection>
          </EuiPageContentHeader>
          <EuiPageContentBody>
            <HitsGrid data={results} />
            <EuiFlexGroup justifyContent="spaceAround">
              <Pagination data={results} />
            </EuiFlexGroup>
          </EuiPageContentBody>
        </EuiPageContent>
      </EuiPageBody>
    </EuiPage>
  )
}

export default App;
