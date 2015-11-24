import * as React from "react";
import SearchBox from "../../search/search-box/src/SearchBox.tsx";
import Hits from "../../search/hits/src/Hits.tsx";
import RefinementListFilter from "../../search/filters/refinement-list-filter/src/RefinementListFilter.tsx";
import MenuFilter from "../../search/filters/menu-filter/src/MenuFilter.tsx";
import HitsStats from "../../search/hits-stats/src/HitsStats.tsx";
import ESClient from "../../../domain/ESClient.ts";

require("./../styles/index.scss");

export default class App extends React.Component<any, any> {

	private search: ESClient;

	constructor(props) {
		super(props);
		this.search = new ESClient("http://localhost:9200", "movies")
		setTimeout(this.runSearch.bind(this), 100);
	}

	runSearch() {
		this.search.search()
	}

	render() {
		return (
			<div className="layout">
				<div className="layout--search-box">
					<SearchBox search={this.search}/>
				</div>

				<div className="layout--filters">
				</div>

				<div className="layout--results-info">
				</div>

				<div className="layout--results">
					<Hits/>
				</div>

			</div>
		);
	}
}
