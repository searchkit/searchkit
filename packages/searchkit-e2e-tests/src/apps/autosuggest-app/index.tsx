import * as ReactDOM from 'react-dom'
import * as React from 'react'

import {
  SearchkitAutosuggest,
  HierarchicalRefinementDatasource,
  FacetFilterDatasource,
  QuickHitsDatasource,
  SuggesterDatasource,
  SuggestQuerySource
} from '@searchkit/autosuggest'

import { RefinementAutosuggest } from '@searchkit/refinement-autosuggest'

import {
  SearchkitManager,
  SearchkitProvider,
  SearchBox,
  Hits,
  RefinementListFilter,
  Pagination,
  HierarchicalMenuFilter,
  HitsStats,
  SortingSelector,
  NoHits,
  SelectedFilters,
  ResetFilters,
  RangeFilter,
  NumericRefinementListFilter,
  ViewSwitcherHits,
  ViewSwitcherToggle,
  Layout,
  TopBar,
  LayoutBody,
  LayoutResults,
  ActionBar,
  ActionBarRow,
  SideBar,
  encodeObjUrl,
  QueryAccessor
} from 'searchkit'

import { MovieHitsGridItem, MovieHitsListItem } from '../../components'

// require("@searchkit/autosuggest/src/styles.css")
require('searchkit/release/theme.css')

const searchkitMovies = new SearchkitManager('http://demo.searchkit.co/api/movies/')
const searchkitTaxonomy = new SearchkitManager('http://demo.searchkit.co/api/taxonomy/')
import './styles.scss'

const Heading = ({ children }) => <div className="my-logo">{children}</div>

const App = () => (
  <div>
    <SearchkitProvider searchkit={searchkitMovies}>
      <Layout>
        <TopBar>
          <Heading>Taxonomy</Heading>
          <SearchkitAutosuggest
            searchkit={searchkitTaxonomy}
            autofocus={true}
            sources={[
              new HierarchicalRefinementDatasource({
                id: 'regions',
                title: 'Regions',
                field: 'taxonomy',
                startLevel: 2,
                onSelect: (_item, categories) => {
                  window.location.href = '/taxonomy-app?' + encodeObjUrl({ categories })
                }
              })
            ]}
          />
        </TopBar>
        <TopBar>
          <Heading>Movies</Heading>
          <SearchkitAutosuggest
            autofocus={true}
            queryHandler={new QueryAccessor('q', {})}
            sources={[
              new SuggestQuerySource(),
              new FacetFilterDatasource({
                accessorId: 'actors',
                size: 5,
                onSelect: (_item, state) => {
                  window.location.href =
                    '/movie-app' +
                    '?' +
                    encodeObjUrl({
                      actorsFacet: state
                    })
                }
              }),
              new FacetFilterDatasource({
                id: 'writers',
                title: 'Writiers',
                field: 'writers.raw',
                size: 5
              }),
              new QuickHitsDatasource({
                title: 'Quick Hits',
                searchFields: ['title'],
                sourceFields: ['title'],
                onSelect: (item) =>
                  // let url = 'http://www.imdb.com/title/' + item._id
                  // window.open(url, '_blank')
                  item._source.title,
                itemRenderer: (item) => <span>{item._source.title}</span>
              })
            ]}
          />
        </TopBar>
        <LayoutBody>
          <SideBar>
            <HierarchicalMenuFilter
              fields={['type.raw', 'genres.raw']}
              title="Categories"
              id="categories"
            />
            {/*<RefinementListFilter
                            id="actors"
                            title="Actors"
                            field="actors.raw"
                            operator="AND"
                        size={10} />*/}
            <RefinementAutosuggest id="actors" title="Actors" field="actors.raw" multi={true} />
          </SideBar>
          <LayoutResults>
            <ActionBar>
              <ActionBarRow>
                <HitsStats />
              </ActionBarRow>

              <ActionBarRow>
                <SelectedFilters />
                <ResetFilters />
              </ActionBarRow>
            </ActionBar>
            <Hits
              mod="sk-hits-grid"
              hitsPerPage={10}
              itemComponent={MovieHitsGridItem}
              sourceFilter={['title', 'poster', 'imdbId']}
            />
            <NoHits />
          </LayoutResults>
        </LayoutBody>
      </Layout>
    </SearchkitProvider>
  </div>
)

ReactDOM.render(<App />, document.getElementById('root'))
