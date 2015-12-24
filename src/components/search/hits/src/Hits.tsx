import * as _ from "lodash";
import * as React from "react";
import "../styles/index.scss";

import {
	SearchkitComponent,
	PageSizeAccessor
} from "../../../../core"

export interface IHits {
	hitsPerPage: number
	mod?:string
}

export class Hits extends SearchkitComponent<IHits, any> {

	defineAccessor(){
		return new PageSizeAccessor("s", this.props.hitsPerPage)
	}

	defineBEMBlocks() {
		let block = (this.props.mod || "hits")
		return {
			container: block,
			item: `${block}-hit`
		}
	}

	renderResult(result:any) {
		return (
			<div className={this.bemBlocks.item().mix(this.bemBlocks.container("item"))} key={result._id}>
			</div>
		)
	}

	renderInitialView() {
		return (
			<div className={this.bemBlocks.container("initial-loading")}></div>
		)
	}

	renderNoResults() {
		return (
			<div className={this.bemBlocks.container("no-results")}>No results</div>
		)
	}

	render() {
		let hits:{}[] = _.get(this.searcher, "results.hits.hits", [])
		let hasHits = _.size(hits) > 0
		let results = null

		if (this.isInitialLoading()) {			
			results = this.renderInitialView()
		} else if (!hasHits) {
			results = this.renderNoResults()
		} else {
			results = _.map(hits, this.renderResult.bind(this))
		}

		return (
			<div className={this.bemBlocks.container()}>
				{results}
      </div>
		);
	}
}
