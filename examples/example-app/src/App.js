import{ DateRangeFacet, MultiMatchQuery, RangeFacet, RefinementSelectFacet } from '@searchkit/sdk'
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
  EuiText,
  EuiFlexGroup,
  EuiFlexItem,
} from '@elastic/eui'

import '@elastic/eui/dist/eui_theme_light.css'
import useSearchkitSDK from './useSearchkitSDKHook';

const config = {
  host: "https://commerce-demo.es.us-east4.gcp.elastic-cloud.com:9243",
  connectionOptions: {
    apiKey: "NWF4c2VYOEJzRDhHMzlEX1JDejU6YnJXaS1XWjlSZ2F5ek1Cc3V4aXV6dw=="
  },
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

const HitsList = ({ data }) => (
  <EuiFlexGrid>
    {data?.hits.items.map((hit) => (
      <EuiFlexItem key={hit.id}>

        <EuiFlexGroup gutterSize="xl">
          <EuiFlexItem>
            <EuiFlexGroup>
              <EuiFlexItem grow={false}>
                <img src={hit.fields.poster} alt="Nature" style={{ height: '150px' }} />
              </EuiFlexItem>
              <EuiFlexItem grow={4}>
                <EuiTitle size="xs">
                  <h6>{hit.fields.title}</h6>
                </EuiTitle>
                <EuiText grow={false}>
                  <p>{hit.fields.plot}</p>
                </EuiText>
              </EuiFlexItem>
              <EuiFlexItem grow={2}>
                <EuiText grow={false}>
                  <ul>
                    <li>
                      <b>ACTORS: </b>
                      {hit.fields.actors.join(', ')}
                    </li>

                    <li>
                      <b>WRITERS: </b>
                      {hit.fields.writers.join(', ')}
                    </li>
                  </ul>
                </EuiText>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiFlexItem>
        </EuiFlexGroup>
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
            <HitsList data={results} />
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
