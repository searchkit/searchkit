import * as React from "react";
import SearchBox from "../../search/search-box/src/SearchBox.tsx";
import Hits from "../../search/hits/src/Hits.tsx";
import RefinementListFilter from "../../search/filters/refinement-list-filter/src/RefinementListFilter.tsx";
import MenuFilter from "../../search/filters/menu-filter/src/MenuFilter.tsx";
import HitsStats from "../../search/hits-stats/src/HitsStats.tsx";

require("./../styles/index.scss");

export default class App extends React.Component<any, any> {

	render() {
		return (
			<div className="layout">
				<div className="layout--search-box">
					<SearchBox/>
				</div>

				<div className="layout--filters">
					<RefinementListFilter/>
					<MenuFilter name="f"/>
				</div>

				<div className="layout--results-info">
					<HitsStats/>
				</div>

				<div className="layout--results">
					<Hits/>
				</div>

			</div>
		);
	}
}
