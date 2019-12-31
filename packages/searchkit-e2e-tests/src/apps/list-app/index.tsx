import {
  SearchkitManager,
  SearchkitProvider,
  SearchBox,
  Hits,
  RefinementListFilter,
  Pagination,
  MenuFilter,
  HitsStats,
  SortingSelector,
  NoHits,
  ItemList,
  CheckboxItemList,
  ItemHistogramList,
  Tabs,
  TagCloud,
  Toggle,
  Select
} from 'searchkit'
const host = 'http://demo.searchkit.co/api/movies'
import * as ReactDOM from 'react-dom'
import * as React from 'react'
import { Router, Route, browserHistory, Link, IndexRoute } from 'react-router'
import { MovieHitsGridItem, MovieHitsListItem } from '../../components'

require('searchkit/release/theme.css')
require('./customisations.scss')

const searchkit = new SearchkitManager(host)

class App extends React.Component<any, any> {
  render() {
    return (
      <SearchkitProvider searchkit={searchkit}>
        <div className="sk-layout list-app">
          <div className="sk-layout__top-bar sk-top-bar">
            <div className="sk-top-bar__content">
              <div className="my-logo">Filter list components</div>
              <SearchBox
                autofocus={true}
                searchOnChange={true}
                prefixQueryFields={['actors^1', 'type^2', 'languages', 'title^10']}
              />
            </div>
          </div>

          <div className="sk-layout__body">
            <div className="sk-layout__filters">
              <div className="sk-layout__filters-row">
                <MenuFilter
                  translations={{ All: 'All options' }}
                  field={'type.raw'}
                  title="ItemList"
                  id="typeList"
                  listComponent={ItemList}
                />
                <MenuFilter
                  field={'type.raw'}
                  title="CheckboxItemList"
                  id="typeList"
                  listComponent={CheckboxItemList}
                />
                <MenuFilter
                  field={'type.raw'}
                  title="ItemHistogramList"
                  id="typeList"
                  listComponent={ItemHistogramList}
                />
                <MenuFilter
                  field={'type.raw'}
                  title="TagCloud"
                  id="typeList"
                  listComponent={TagCloud}
                />
                <MenuFilter field={'type.raw'} title="Tabs" id="typeList" listComponent={Tabs} />
                <MenuFilter
                  countFormatter={(count) => '#' + count}
                  field={'type.raw'}
                  title="Select"
                  id="typeList"
                  listComponent={Select}
                />
              </div>
            </div>

            <div className="sk-layout__results sk-results-list">
              <div className="sk-action-bar__info">
                <HitsStats
                  translations={{
                    'hitstats.results_found': '{hitCount} results found'
                  }}
                />
              </div>
              <Hits
                hitsPerPage={12}
                highlightFields={['title', 'plot']}
                sourceFilter={['plot', 'title', 'poster', 'imdbId', 'imdbRating', 'year']}
                mod="sk-hits-list"
                itemComponent={MovieHitsListItem}
                scrollTo="body"
              />
              <NoHits suggestionsField={'title'} />
              <Pagination showNumbers={true} />
            </div>
          </div>
        </div>
      </SearchkitProvider>
    )
  }
}

const View = (props) => (
  <div>
    <Link to={'/list-app'}>go to list</Link>
    <a onClick={props.history.goBack}>go back</a>
  </div>
)

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/list-app">
      <IndexRoute component={App} />
      <Route path="view/:id" component={View} />
    </Route>
  </Router>,
  document.getElementById('root')
)
