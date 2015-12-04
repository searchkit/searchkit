
import SearchBox from "../../search/search-box/src/SearchBox";
import Hits from "../../search/hits/src/Hits";
import HitsStats from "../../search/hits-stats/src/HitsStats";
import RefinementListFilter from "../../search/filters/refinement-list-filter/src/RefinementListFilter";

import SearchkitComponent from "../../../domain/new/SearchkitComponent"
import Searcher from "../../../domain/new/Searcher"
import SearcherProvider from "../../../domain/new/SearcherProvider"

require("./../styles/index.scss");

export default class App extends SearchkitComponent<any, any> {
	primarySearcher:Searcher

	componentWillMount(){
		super.componentWillMount()
		this.primarySearcher = this.searchkit.createSearcher()
	}

	render(){
		return (
			<SearcherProvider searcher={this.primarySearcher}>
				<div className="layout">
					<div className="layout__search-box">
						<SearchBox/>
					</div>

					<div className="layout__filters">
						<RefinementListFilter title="Actors" field="actors.raw" operator="AND"/>
						<RefinementListFilter title="Languages" field="languages.raw" operator="OR"/>
					</div>
					<div className="layout__results-info">
						<HitsStats/>
					</div>
					<div className="layout__results">
						<Hits hitsPerPage={50} render="movies"/>
					</div>
				</div>
			</SearcherProvider>

		);

	}

}
