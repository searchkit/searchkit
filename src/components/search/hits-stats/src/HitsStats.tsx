import * as _ from "lodash";
import * as React from "react";
import "../styles/index.scss";

import {
	SearchkitComponent,
} from "../../../../core"

export interface IHitsStats {
	mod?:string
}

export class HitsStats extends SearchkitComponent<IHitsStats, any> {

	defineBEMBlocks() {
		return {
			container: (this.props.mod || "hits-stats")
		}
	}

	getHitCount():number {
		return _.get(this.searcher, "results.hits.total", 0)
	}

	render() {
		return (
			<div className={this.bemBlocks.container()}>
				<div className={this.bemBlocks.container("info")}>{this.getHitCount()} results found</div>
      </div>
		);
	}
}
