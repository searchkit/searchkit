import * as React from "react";
import SearchBox from "../../search/search-box/src/SearchBox.tsx";
import Hits from "../../search/hits/src/Hits.tsx";
import RefinementListFilter from "../../search/filters/refinement-list-filter/src/RefinementListFilter.tsx";
import MenuFilter from "../../search/filters/menu-filter/src/MenuFilter.tsx";
import HitsStats from "../../search/hits-stats/src/HitsStats.tsx";
import ESClient from "../../../domain/ESClient.ts";
import * as Rx from "rx"
require("./../styles/index.scss");

export default class App extends React.Component<any, any> {

	private searcher: ESClient;
	results:any
	searcherUnsubscribe:Rx.IDisposable
	
	constructor(props) {
		super(props);		
		this.searcher = new ESClient("http://localhost:9200", "movies")		
		this.searcher.search()
	}
	componentWillMount(){
		this.searcherUnsubscribe = this.searcher.resultsListener.subscribe(
			()=> this.forceUpdate()
		)		
	}
	
	componentWillUnmount(){
		this.searcherUnsubscribe.dispose()
	}


	hits(){
		if(this.searcher.results.hits) {
			return <Hits results={this.searcher.results.hits.hits}/>
		}
	}

	render() {
		return (
			<div className="layout">
				<div className="layout__search-box">
					<SearchBox searcher={this.searcher}/>
				</div>

				<div className="layout__filters">
					<RefinementListFilter searcher={this.searcher} field="genres"/>
					<RefinementListFilter searcher={this.searcher} field="actors"/>
				</div>

				<div className="layout__results-info">
				</div>

				<div className="layout__results">
					{this.hits()}
				</div>

			</div>
		);
	}
}
