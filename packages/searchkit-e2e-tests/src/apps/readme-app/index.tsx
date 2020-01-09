import * as ReactDOM from 'react-dom'
import * as React from 'react'

//Simulate script include of searchkit
window['ReactDOM'] = ReactDOM
window['React'] = React
import { MovieHitsGridItem, MovieHitsListItem } from '../../components'
const searchkitRaw = require('raw-loader!searchkit/release/bundle.js')
const script = document.createElement('script')
script.type = 'text/javascript'
script.innerHTML = searchkitRaw
document.getElementsByTagName('head')[0].appendChild(script)

const {
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
  ViewSwitcherToggle
} = window['Searchkit']

const { Layout, TopBar, LayoutBody, LayoutResults, ActionBar, ActionBarRow, SideBar } = window[
  'Searchkit'
]

require('searchkit/release/theme.css')

const searchkit = new SearchkitManager('http://demo.searchkit.co/api/movies/')

const App = () => (
  <SearchkitProvider searchkit={searchkit}>
    <Layout>
      <TopBar>
        <SearchBox
          autofocus={true}
          searchOnChange={true}
          prefixQueryFields={['actors^1', 'type^2', 'languages', 'title^10']}
        />
      </TopBar>
      <LayoutBody>
        <SideBar>
          <HierarchicalMenuFilter
            fields={['type.raw', 'genres.raw']}
            title="Categories"
            id="categories"
          />
          <RefinementListFilter
            id="actors"
            title="Actors"
            field="actors.raw"
            operator="AND"
            size={10}
          />
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
)

ReactDOM.render(<App />, document.getElementById('root'))
