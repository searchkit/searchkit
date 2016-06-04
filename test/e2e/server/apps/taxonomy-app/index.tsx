import * as React from "react";
import * as ReactDOM from "react-dom";

import {
  SearchBox,
  Hits,
  HierarchicalRefinementFilter,
  RefinementListFilter,
  NumericRefinementListFilter,
  DynamicRangeFilter,
  Pagination,
  ResetFilters,
  SelectedFilters,
  SearchkitComponent,
  HitsStats,
  SearchkitManager,
  SearchkitProvider,
  NoHits,
  InitialLoader,
  RangeFilter
} from "../../../../../src"

import "./customisations.scss";
require("../../../../../theming/theme.scss")

const TaxonomyHitsItem = (props)=> {
  const {result, bemBlocks} = props
  return (
    <div className={bemBlocks.item().mix(bemBlocks.container("item"))}>
      {result._source.name}
    </div>
  )
}

export class App extends React.Component<any, any> {

  searchkit:SearchkitManager

  constructor() {
    super()
    const host = "http://demo.searchkit.co/api/taxonomy"
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
          <HierarchicalRefinementFilter field="taxonomy" id="categories" title="Region" startLevel={2}/>
          <RefinementListFilter
            field="taxonomy.value"
            fieldOptions={{type:'nested', options:{path:"taxonomy"}}}
            size={10}
            id="NestedTest" title="Nested Test"/>
          <NumericRefinementListFilter
            field="taxonomy.level"
            options={[
              {title:"All"},
              {title:"1", from:1, to:2},
              {title:"2", from:2, to:3},
              {title:"3", from:3}
            ]}
            fieldOptions={{type:'nested', options:{path:"taxonomy"}}}
            id="NestedNumeric" title="Nested Numeric"/>
          <RangeFilter min={1} max={6} field="taxonomy.level" id="levelRange"
            title="Taxonomy level range" fieldOptions={{type:"nested", options:{path:"taxonomy"}}}/>

            <DynamicRangeFilter field="taxonomy.level" id="levelRangeDynamic"
              title="Taxonomy level Dynamic range" fieldOptions={{type:"nested", options:{path:"taxonomy"}}}/>

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
