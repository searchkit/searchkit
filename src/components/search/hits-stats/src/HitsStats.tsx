import * as _ from "lodash";
import * as React from "react";
import "../styles/index.scss";

import {
	SearchkitComponent,
	SearchkitComponentProps
} from "../../../../core"

export interface HitsStatsProps extends SearchkitComponentProps {
}

export class HitsStats extends SearchkitComponent<HitsStatsProps, any> {

	translations = {
		"ResultsFound":"results found"
	}

	defineBEMBlocks() {
		return {
			container: (this.props.mod || "hits-stats")
		}
	}

	getHitCount():number {
		return _.get(this.getResults(), "hits.total", 0)
	}

	getTime():number {
		return _.get(this.getResults(),"took", 0)
	}

	renderText() {
		return (
			<div className={this.bemBlocks.container("info")} data-qa="info">
				{this.getHitCount()} {this.translate("ResultsFound")}
			</div>
		)
	}

	render() {
		return (
			<div className={this.bemBlocks.container()} data-qa="hits-stats">
				{this.renderText()}
      </div>
		);
	}
}
