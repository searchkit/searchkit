const {
  SearchkitManager,
  SearchkitProvider,
  SearchBox,
  Hits,
  RefinementListFilter,
  Pagination,
  RangeFilter,
  HitsStats,
  SortingSelector,
  NoHits,
  RangeHistogram,
  RangeSlider,
  RangeInput,
  RangeSliderHistogram,
  RangeSliderHistogramInput,
  RangeSliderInput,
  RangeHistogramInput
} = require('searchkit')
const host = 'http://demo.searchkit.co/api/movies'
import * as ReactDOM from 'react-dom'
import * as React from 'react'
import { MovieHitsGridItem, MovieHitsListItem } from '../../components'

const searchkit = new SearchkitManager(host)

require('searchkit/release/theme.css')
require('./customisations.scss')

class App extends React.Component<any, any> {
  render() {
    return (
      <SearchkitProvider searchkit={searchkit}>
        <div className="sk-layout range-app">
          <div className="sk-layout__top-bar sk-top-bar">
            <div className="sk-top-bar__content">
              <div className="my-logo">Range components</div>
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
                <RangeFilter
                  min={0}
                  max={100}
                  field="metaScore"
                  id="metascore"
                  title="RangeHistogram"
                  rangeComponent={RangeHistogram}
                />
                <RangeFilter
                  min={0}
                  max={100}
                  field="metaScore"
                  id="metascore"
                  title="RangeSliderHistogram"
                  rangeComponent={RangeSliderHistogram}
                />
                <RangeFilter
                  min={0}
                  max={100}
                  field="metaScore"
                  id="metascore"
                  title="RangeHistogramInput"
                  rangeComponent={RangeHistogramInput}
                />
                <RangeFilter
                  min={0}
                  max={100}
                  field="metaScore"
                  id="metascore"
                  title="RangeSliderHistogramInput"
                  rangeComponent={RangeSliderHistogramInput}
                />
                <RangeFilter
                  min={0}
                  max={100}
                  field="metaScore"
                  id="metascore"
                  title="RangeSlider"
                  rangeComponent={RangeSlider}
                  rangeFormatter={(count) => count + ' stars'}
                />
                <RangeFilter
                  min={0}
                  max={100}
                  field="metaScore"
                  id="metascore"
                  title="RangeInput"
                  rangeComponent={RangeInput}
                />
                <RangeFilter
                  min={0}
                  max={100}
                  field="metaScore"
                  id="metascore"
                  title="RangeSliderInput"
                  rangeComponent={RangeSliderInput}
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
                mod="sk-hits-grid"
                itemComponent={MovieHitsGridItem}
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

ReactDOM.render(<App />, document.getElementById('root'))
