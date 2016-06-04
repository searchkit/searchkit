import * as React from "react";
import * as ReactDOM from "react-dom";

import {
  SearchBox,
  Hits,
  HierarchicalRefinementFilter,
  RefinementListFilter,
  Pagination,
  ResetFilters,
  SelectedFilters,
  SearchkitComponent,
  HitsStats,
  SearchkitManager,
  SearchkitProvider,
  NoHits,
  InitialLoader
} from "../../../../../src"

import "./customisations.scss";
require("../../../../../theming/theme.scss")

const TaxonomyHitsItem = (props)=> {
  const {result, bemBlocks} = props
  return (
    <div className={bemBlocks.item().mix(bemBlocks.container("item"))}>
      {result._source.path}
    </div>
  )
}

export class App extends React.Component<any, any> {

  searchkit:SearchkitManager

  constructor() {
    super()
    const host = "http://localhost:9200/taxonomynested/locations"
    this.searchkit = new SearchkitManager(host)
  }

  render(){ return (
    <div>
    <SearchkitProvider searchkit={this.searchkit}>
    <div className="sk-layout">

      <div className="sk-layout__top-bar sk-top-bar">
        <div className="sk-top-bar__content">
          <div className="my-logo">Searchkit Acme co</div>
          <SearchBox
            translations={{"searchbox.placeholder":"search regions"}}
            queryOptions={{"minimum_should_match":"70%"}}
            autofocus={true}
            searchOnChange={true}
            queryFields={["title^5"]}/>
        </div>
      </div>

      <div className="sk-layout__body">

  			<div className="sk-layout__filters">
          <RefinementListFilter
            field="level"
            fieldOptions={{type:'children', options:{childrenType:"nodes"}}}
            size={10}
            id="NestedTest" title="Nested Test"/>
  			</div>

        <div className="sk-layout__results sk-results-list">

          <div className="sk-results-list__action-bar sk-action-bar">

            <div className="sk-action-bar__info">
              <HitsStats/>
            </div>

            <div className="sk-action-bar__filters">
              <SelectedFilters/>
              <ResetFilters/>
            </div>
          </div>

  				<Hits hitsPerPage={10} mod="sk-hits-list" itemComponent={TaxonomyHitsItem}/>
          <NoHits/>
          <InitialLoader/>
  				<Pagination showNumbers={true}/>
        </div>
			</div>
			<a className="view-src-link" href="https://github.com/searchkit/searchkit-demo/blob/master/src/app/src/TaxonomyApp.tsx">View source »</a>
		</div>
    </SearchkitProvider>
    </div>
	)}

}

ReactDOM.render(<App/>, document.getElementById("root"))
