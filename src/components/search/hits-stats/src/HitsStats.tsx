import * as React from "react";
import ESClient from "../../../../domain/ESClient.ts";
import * as _ from "lodash";
import SearchkitComponent from "../../../SearchkitComponent.ts";

require("./../styles/index.scss");

interface IHitsStats {
}

export default class HitsStats extends SearchkitComponent<IHitsStats, any> {

	getHitCount():number {
		return _.get(this.searcher, "results.hits.total", 0)
	}

	render() {
		return (
			<div className="hits-stats">
				<div className="hits-stats__info">{this.getHitCount()} results found</div>
      </div>
		);
	}
}
