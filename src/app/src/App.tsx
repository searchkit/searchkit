import * as React from "react";

import {
	SearchBox,
	Hits,
	HitsStats,
	RefinementListFilter,
	Pagination,
	ResetFilters,
	MenuFilter,
	SelectedFilters,
	HierarchicalMenuFilter
} from "../../components"

import {
	SearchkitComponent,
	Searcher,
	SearchType,
	SearcherProvider,
	LoadingComponent
} from "../../core"

require("./../styles/index.scss");

class MovieHits extends Hits {
	renderResult(result:any) {
		return (
			<div className="hit" key={result._id}>
				<img className="hit__poster" src={result._source.poster}/>
				<div className="hit__title">{result._source.title}</div>
			</div>
		)
	}
}

export class App extends SearchkitComponent<any, any> {
	primarySearcher:Searcher

	componentWillMount(){
		super.componentWillMount()
		this.primarySearcher = this.searchkit.createSearcher()
		this.primarySearcher.search_type=SearchType.query_then_fetch
	}

	render(){
		return (
			<SearcherProvider searcher={this.primarySearcher}>
				<div className="layout">
					<div className="layout__search-box">
						<SelectedFilters/>
						<SearchBox/>
					</div>

					<div className="layout__filters">
						<ResetFilters />
						<HierarchicalMenuFilter fields={["type.raw", "genres.raw"]} title="Categories" id="categories"/>
						<RefinementListFilter title="Actors" field="actors.raw" operator="AND"/>
						<RefinementListFilter title="Languages" field="languages.raw" operator="OR"/>
						<RefinementListFilter title="Countries" field="countries.raw" operator="OR"/>
					</div>
					<div className="layout__results-info">
						<HitsStats/>
					</div>
					<div className="layout__results">
						<MovieHits hitsPerPage={50}/>
						<Pagination/>
					</div>
				</div>
			</SearcherProvider>

		);

	}

}
