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


require("./../styles/index.scss");

export default class App extends React.Component<any, any> {

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
