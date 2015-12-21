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

	render() {
		let hits:{}[] = _.get(this.searcher, "results.hits.hits", null)

		return (
			<div className={this.bemBlocks.container()}>
				{_.map(hits, this.renderResult.bind(this))}
      </div>
		);
	}
}
