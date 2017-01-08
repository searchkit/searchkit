const {
  SearchkitManager,SearchkitProvider,
  SearchBox, Hits, RefinementListFilter, Pagination,
  RangeFilter, HitsStats, SortingSelector, NoHits,
  RangeHistogram, RangeSlider, RangeInput, RangeSliderHistogram,
  RangeSliderHistogramInput, RangeSliderInput, RangeHistogramInput
} = require("../../../../../src")
const host = "http://demo.searchkit.co/api/movies"
import * as ReactDOM from "react-dom";
import * as React from "react";
const searchkit = new SearchkitManager(host)

import * as _ from "lodash"

require("../../../../../theming/theme.scss")
require("./customisations.scss")

const MovieHitsGridItem = (props)=> {
  const {bemBlocks, result} = props
  let url = "http://www.imdb.com/title/" + result._source.imdbId
  const source:any = _.extend({}, result._source, result.highlight)
  return (
    <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
      <a href={url} target="_blank">
        <img data-qa="poster" className={bemBlocks.item("poster")} src={result._source.poster} width="170" height="240"/>
        <div data-qa="title" className={bemBlocks.item("title")} dangerouslySetInnerHTML={{__html:source.title}}>
        </div>
      </a>
    </div>
  )
}

const MovieHitsListItem = (props)=> {
  const {bemBlocks, result} = props
  let url = "http://www.imdb.com/title/" + result._source.imdbId
  const source:any = _.extend({}, result._source, result.highlight)
  return (
    <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
      <div className={bemBlocks.item("poster")}>
        <img data-qa="poster" src={result._source.poster}/>
      </div>
      <div className={bemBlocks.item("details")}>
        <a href={url} target="_blank"><h2 className={bemBlocks.item("title")} dangerouslySetInnerHTML={{__html:source.title}}></h2></a>
        <h3 className={bemBlocks.item("subtitle")}>Released in {source.year}, rated {source.imdbRating}/10</h3>
        <div className={bemBlocks.item("text")} dangerouslySetInnerHTML={{__html:source.plot}}></div>
      </div>
    </div>
  )
}

class App extends React.Component<any, any> {
  render(){
    return (
      <SearchkitProvider searchkit={searchkit}>
        <div className="sk-layout range-app">

          <div className="sk-layout__top-bar sk-top-bar">
            <div className="sk-top-bar__content">
              <div className="my-logo">Range components</div>
              <SearchBox autofocus={true} searchOnChange={true} prefixQueryFields={["actors^1","type^2","languages","title^10"]}/>
            </div>
          </div>

          <div className="sk-layout__body">

            <div className="sk-layout__filters">
              <div className="sk-layout__filters-row">
                <RangeFilter min={0} max={100} field="metaScore" id="metascore" title="RangeHistogram" rangeComponent={RangeHistogram}/>
                <RangeFilter min={0} max={100} field="metaScore" id="metascore" title="RangeSliderHistogram" rangeComponent={RangeSliderHistogram}/>
                <RangeFilter min={0} max={100} field="metaScore" id="metascore" title="RangeHistogramInput" rangeComponent={RangeHistogramInput}/>
                <RangeFilter min={0} max={100} field="metaScore" id="metascore" title="RangeSliderHistogramInput" rangeComponent={RangeSliderHistogramInput}/>
                <RangeFilter min={0} max={100} field="metaScore" id="metascore" title="RangeSlider" rangeComponent={RangeSlider} rangeFormatter={(count)=> count + " stars" }/>
                <RangeFilter min={0} max={100} field="metaScore" id="metascore" title="RangeInput" rangeComponent={RangeInput}/>
                <RangeFilter min={0} max={100} field="metaScore" id="metascore" title="RangeSliderInput" rangeComponent={RangeSliderInput}/>
              </div>
            </div>

            <div className="sk-layout__results sk-results-list">
              <div className="sk-action-bar__info">
                <HitsStats translations={{
                  "hitstats.results_found":"{hitCount} results found"
                }}/>
              </div>
              <Hits
                  hitsPerPage={12} highlightFields={["title","plot"]}
                  sourceFilter={["plot", "title", "poster", "imdbId", "imdbRating", "year"]}
                  mod="sk-hits-grid" itemComponent={MovieHitsGridItem} scrollTo="body"
              />
              <NoHits suggestionsField={"title"}/>
              <Pagination showNumbers={true}/>
            </div>
          </div>
        </div>
      </SearchkitProvider>
    )
  }
}

ReactDOM.render(<App/>, document.getElementById("root"))
