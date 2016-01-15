import * as _ from "lodash";
import * as React from "react";
import "../styles/no-hits.scss";

import {
	SearchkitComponent,
	SearchkitComponentProps
} from "../../../../core"

export interface NoHitsProps extends SearchkitComponentProps {
}

export class NoHits extends SearchkitComponent<NoHitsProps, any> {
	static translations:any = {
		"nohits.no_results":"no results found"
	}
	translations = NoHits.translations

	static propTypes = _.defaults({
		translations:SearchkitComponent.translationsPropType(
			NoHits.translations
		)
	}, SearchkitComponent.propTypes)

	defineBEMBlocks() {
		let block = (this.props.mod || "no-hits")
		return {
			container: block
		}
	}

	render() {
    if (this.hasHits() || this.isInitialLoading()) return null

		return (
			<div data-qa="no-hits" className={this.bemBlocks.container()}>
				{this.translate("nohits.no_results")}
      </div>
		);
	}
}
