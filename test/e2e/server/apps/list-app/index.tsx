import {
  SearchkitManager,SearchkitProvider,
  SearchBox, Hits, RefinementListFilter, Pagination,
  MenuFilter, HitsStats, SortingSelector, NoHits,
  ItemList, CheckboxItemList, ItemHistogramList,
  Tabs, TagCloud, Toggle, Select
} from "../../../../../src"
const host = "http://demo.searchkit.co/api/movies"
import * as ReactDOM from "react-dom"
import * as React from "react"
import {Router, Route, browserHistory, Link, IndexRoute} from 'react-router'

import * as _ from "lodash"

import "../../../../../theming/theme.scss"
import "./customisations.scss"

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
        <Link to={`/list-app/view/${result._source.imdbId}`}>
          <h2 className={bemBlocks.item("title")} dangerouslySetInnerHTML={{__html:source.title}}></h2>
        </Link>
        <h3 className={bemBlocks.item("subtitle")}>Released in {source.year}, rated {source.imdbRating}/10</h3>
        <div className={bemBlocks.item("text")} dangerouslySetInnerHTML={{__html:source.plot}}></div>
      </div>
    </div>
  )
}

const searchkit = new SearchkitManager(host)

class App extends React.Component<any, any> {

  render(){
    return (
      <SearchkitProvider searchkit={searchkit}>
        <div className="sk-layout list-app">

          <div className="sk-layout__top-bar sk-top-bar">
            <div className="sk-top-bar__content">
              <div className="my-logo">Filter list components</div>
              <SearchBox autofocus={true} searchOnChange={true} prefixQueryFields={["actors^1","type^2","languages","title^10"]}/>
            </div>
          </div>

          <div className="sk-layout__body">

            <div className="sk-layout__filters">
              <div className="sk-layout__filters-row">
                <MenuFilter translations={{"All":"All options"}} field={"type.raw"} title="ItemList" id="item-list" listComponent={ItemList} />
                <MenuFilter field={"type.raw"} title="CheckboxItemList" id="checkbox-item-list" listComponent={CheckboxItemList} />
                <MenuFilter field={"type.raw"} title="ItemHistogramList" id="histogram-list" listComponent={ItemHistogramList} />
                <MenuFilter field={"type.raw"} title="TagCloud" id="tag-cloud" listComponent={TagCloud} />
                <MenuFilter field={"type.raw"} title="Toggle" id="toggle" listComponent={Toggle} />
                <MenuFilter field={"type.raw"} title="Tabs" id="tabs" listComponent={Tabs} />
                <MenuFilter countFormatter={(count)=> "#"+count} field={"type.raw"} title="Select" id="select" listComponent={Select} />

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
                  mod="sk-hits-list" itemComponent={MovieHitsListItem} scrollTo="body"
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

const View = (props) => {
  return (<div>
    <Link to={'/list-app'}>go to list</Link>
    <a onClick={props.history.goBack}>go back</a>
    </div>)
}

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/list-app">
      <IndexRoute component={App}/>
      <Route path="view/:id" component={View}/>
    </Route>
  </Router>
), document.getElementById("root"))
