import * as React from "react";

import {
	SearchBox,
	Hits,
	HitsStats,
	RefinementListFilter,
	Pagination,
	ResetFilters,
	MenuFilter
} from "../../components"

import {
	SearchkitComponent,
	Searcher,
	SearcherProvider
} from "../../core"

require("./../styles/index.scss");

export class App extends SearchkitComponent<any, any> {
	primarySearcher:Searcher

	componentWillMount(){
		super.componentWillMount()
		this.primarySearcher = this.searchkit.createSearcher()
		this.primarySearcher.search_type="query_then_fetch"
	}

	render(){
		return (
			<SearcherProvider searcher={this.primarySearcher}>
				<div className="layout">
					<div className="layout__search-box">
						<SearchBox/>
					</div>

					<div className="layout__filters">
						<ResetFilters />
						<MenuFilter title="Type" field="type.raw"/>
						<RefinementListFilter title="Actors" field="actors.raw" operator="AND"/>
						<RefinementListFilter title="Languages" field="languages.raw" operator="OR"/>
						<RefinementListFilter title="Countries" field="countries.raw" operator="OR"/>
					</div>
					<div className="layout__results-info">
						<HitsStats/>
					</div>
					<div className="layout__results">
						<Hits hitsPerPage={50}/>
						<Pagination/>
					</div>
				</div>
			</SearcherProvider>

		);

	}

}
