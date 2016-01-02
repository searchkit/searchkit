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

	getResults() {
		return _.get(this.searcher, "results", {})
	}

	getHitCount():number {
		return _.get(this.getResults(), "hits.total", 0)
	}

	getTime():number {
		return _.get(this.getResults(),"took", 0)
	}

	renderText() {
		return (
			<div className={this.bemBlocks.container("info")}>
				{this.getHitCount()} results found
			</div>
		)
	}

	render() {
		return (
			<div className={this.bemBlocks.container()}>
				{this.renderText()}
      </div>
		);
	}
}
