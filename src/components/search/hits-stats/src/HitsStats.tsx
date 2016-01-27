import * as React from "react";
import "../styles/index.scss";
import {
	SearchkitComponent,
	SearchkitComponentProps
} from "../../../../core"

const defaults = require("lodash/defaults")
const get = require("lodash/get")

export interface HitsStatsProps extends SearchkitComponentProps {
}

export class HitsStats extends SearchkitComponent<HitsStatsProps, any> {

	static translations:any = {
		"hitstats.results_found":"{hitCount} results found in {timeTaken}ms"
	}
	translations = HitsStats.translations

	static propTypes = defaults({
		translations:SearchkitComponent.translationsPropType(
			HitsStats.translations
		)
	}, SearchkitComponent.propTypes)

	defineBEMBlocks() {
		return {
			container: (this.props.mod || "hits-stats")
		}
	}

	getTime():number {
		return get(this.getResults(),"took", 0)
	}

	renderText() {
		return (
			<div className={this.bemBlocks.container("info")} data-qa="info">
				{this.translate("hitstats.results_found", {
					timeTaken:this.getTime(),
					hitCount:this.searchkit.getHitsCount()
				})
				}
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
