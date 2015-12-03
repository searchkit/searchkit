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
					<HierarchicalMenuFilter fields={["animalsAge_lvl1"]} title="Age"/>
					<RefinementListFilter field="peopleGender_lvl1" title="Gender" operator="OR"/>
					<div className="layout__filters__heading">Refine results by</div>
					<RefinementListFilter field="filetype" title="Filetype" operator="OR"/>
					<RefinementListFilter field="resolution" title="Resolution" operator="AND"/>

				</div>

				<div className="layout__results-info">
					<HitsStats/>
				</div>

				<div className="layout__results">
					<Hits hitsPerPage={50} render="assets"/>
					<Pagination/>
				</div>

			</div>
		);
	}
}
