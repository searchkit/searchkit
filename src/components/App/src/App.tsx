import * as React from "react";

import {
	SearchBox,
	Hits,
	RefinementListFilter,
	MenuFilter,
	HitsStats,
	ResetFilters,
	Pagination,
	SelectedFilters,
	HierarchicalMenuFilter
} from "../../index.ts";
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
					<ResetFilters />
					<HierarchicalMenuFilter fields={["type.raw", "genres.raw"]} title="Categories"/>
					<div className="layout__filters__heading">Refine Results By</div>
					<RefinementListFilter title="Actors" field="actors.raw" operator="AND"/>
					<RefinementListFilter title="Languages" field="languages.raw" operator="OR"/>
					<RefinementListFilter title="Countries" field="countries.raw" operator="OR"/>
				</div>

				<div className="layout__results-info">
					<HitsStats/>
				</div>

				<div className="layout__results">
					<Hits hitsPerPage={50} render="movies"/>
					<Pagination/>
				</div>

			</div>
		);
	}
}
