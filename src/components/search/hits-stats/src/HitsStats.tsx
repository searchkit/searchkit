import * as _ from "lodash";
import * as React from "react";
import "../styles/index.scss";


import {
	SearchkitComponent,
} from "../../../../core"

export interface IHitsStats {
}

export class HitsStats extends SearchkitComponent<IHitsStats, any> {

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
