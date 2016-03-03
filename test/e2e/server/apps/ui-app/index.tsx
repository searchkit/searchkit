const {
  SearchkitManager,SearchkitProvider,
  SearchBox, Hits, RefinementListFilter, Pagination,
  HierarchicalMenuFilter, HitsStats, SortingSelector, NoHits,
  SelectedFilters, ResetFilters, RangeFilter, NumericRefinementListFilter,
  Panel, TagCloud, Toggle, Select, Tabs,
  RangeSlider, RangeHistogram,
} = require("../../../../../src")

const host = "http://demo.searchkit.co/api/movies"
import * as ReactDOM from "react-dom";
import * as React from "react";
const searchkit = new SearchkitManager(host)
import {MockList} from "./MockList"
import {MockRange} from "./MockRange"
const _ = require("lodash")

require("../../../../../theming/theme.scss")

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


class App extends React.Component<any, any> {
  render(){
    return (
      <SearchkitProvider searchkit={searchkit}>
        <div className="sk-layout">

          <div className="sk-layout__body">
            <div className="sk-layout__filters">
              <Panel title='My Panel' collapsable={true}>
                <p>panel contents</p>
              </Panel>
              <MockList title="Tag Cloud" listComponent={TagCloud}/>
              <MockList title="Toggle" listComponent={Toggle}/>
              <MockList title="Select" listComponent={Select}/>
              <MockList title="Tabs" listComponent={Tabs}/>
              <MockRange title="RangeSlider" rangeComponent={RangeSlider}/>
              <MockRange title="RangeHistogram" rangeComponent={RangeHistogram}/>
            </div>

            <div className="sk-layout__results sk-results-list">

              <div className="sk-results-list__action-bar sk-action-bar">

                <div className="sk-action-bar__info">
                  <HitsStats translations={{
                    "hitstats.results_found":"{hitCount} results found"
                  }}/>
                  <SortingSelector options={[
                    {label:"Relevance", field:"_score", order:"desc"},
                    {label:"Latest Releases", field:"released", order:"desc"},
                    {label:"Earliest Releases", field:"released", order:"asc"}
                  ]}/>
                </div>

                <div className="sk-action-bar__filters">
                  <SelectedFilters/>
                  <ResetFilters/>
                </div>

              </div>
              <Hits hitsPerPage={10} highlightFields={["title"]} itemComponent={MovieHitsGridItem} mod="sk-hits-grid"/>
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
