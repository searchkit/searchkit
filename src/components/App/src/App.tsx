import * as React from "react";

import {
	SearchBox,
	Hits,
	RefinementListFilter,
	MenuFilter,
	HitsStats,
	ResetFilters,
	Pagination,
	SelectedFilters
} from "../../search/index.ts";
import ESClient from "../../../domain/ESClient.ts";

import * as Rx from "rx"
require("./../styles/index.scss");

export default class App extends React.Component<any, any> {

	private searcher: ESClient;
	results:any
	searcherUnsubscribe:Rx.IDisposable

	constructor(props) {
		super(props);
		console.log(props)
		this.searcher = props.searcher
	}
	componentWillMount(){
		this.searcherUnsubscribe = this.searcher.resultsListener.subscribe(
			()=> this.forceUpdate()
		)
	}
	componentDidMount(){
		console.log("mounted")
		this.searcher.completeRegistration()
	}

	componentWillUnmount(){
		this.searcherUnsubscribe.dispose()
	}

	render() {
		return (
			<div className="layout">
				<div className="layout__search-box">
					<SelectedFilters/>
					<SearchBox/>
				</div>

				<div className="layout__filters">
					<ResetFilters/>
					<MenuFilter field="type.raw" title="Type"/>
					<div className="layout__filters__heading">Refine Results By</div>
					<RefinementListFilter title="Genres" field="genres.raw" operator="OR"/>
					<RefinementListFilter title="Actors" field="actors.raw" operator="AND"/>
				</div>

				<div className="layout__results-info">
					<HitsStats/>
				</div>

				<div className="layout__results">
					<Hits hitsPerPage={50}/>
					<Pagination/>
				</div>

			</div>
		);
	}
}
