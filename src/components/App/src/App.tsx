import * as React from "react";
import SearchBox from "../../search/search-box/src/SearchBox.tsx";
import Hits from "../../search/hits/src/Hits.tsx";
import RefinementListFilter from "../../search/filters/refinement-list-filter/src/RefinementListFilter.tsx";
import MenuFilter from "../../search/filters/menu-filter/src/MenuFilter.tsx";
import HitsStats from "../../search/hits-stats/src/HitsStats.tsx";
import ESClient from "../../../domain/ESClient.ts";

require("./../styles/index.scss");

export default class App extends React.Component<any, any> {

	private searcher: ESClient;
	results:any
	constructor(props) {
		super(props);
		this.searcher = props.searcher		
	}


	hits(){		
		if(this.searcher.results.hits) {
			return <Hits results={this.searcher.results.hits.hits}/>
		}
	}

	render() {
		return (
			<div className="layout">
				<div className="layout--search-box">
					<SearchBox searcher={this.searcher}/>
				</div>

				<div className="layout--filters">
				</div>

				<div className="layout--results-info">
				</div>

				<div className="layout--results">
					{this.hits()}
				</div>

			</div>
		);
	}
}
