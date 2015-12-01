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
} from "../../search/index.ts";
import ESClient from "../../../domain/ESClient.ts";


// require("./../styles/index.scss");

export default class AssetsApp extends React.Component<any, any> {

	render() {
		return (
			<div className="layout">
				<div className="layout__search-box">
					<SelectedFilters/>
					<SearchBox/>
				</div>

				<div className="layout__filters">
					<ResetFilters />
          <HierarchicalMenuFilter fields={["animalsClassification_lvl1", "animalsClassification_lvl2", "animalsClassification_lvl3"]} title="Classification"/>
					<HierarchicalMenuFilter fields={["ethnicityCountry_lvl1", "ethnicityCountry_lvl2"]} title="Ethnicity"/>
          <RefinementListFilter field="animalsAge_lvl1" title="Age" operator="OR"/>
          <RefinementListFilter field="peopleGender_lvl1" title="Gender" operator="OR"/>
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
