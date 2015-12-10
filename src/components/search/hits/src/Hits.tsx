import * as _ from "lodash";
import * as React from "react";
import * as classNames from 'classnames';
import {
	SearchkitComponent,
	PageSizeAccessor
} from "../../../../core"

export interface IHits {
	hitsPerPage: number
}

export class Hits extends SearchkitComponent<IHits, any> {

	defineAccessor(){
		return new PageSizeAccessor("s", this.props.hitsPerPage)
	}

	renderResult(result:any) {
		return (
			<div className="hit" key={result._id}>
			</div>
		)
	}

	render() {
		let hits:{}[] = _.get(this.searcher, "results.hits.hits", null)
		let className = classNames({
			"hits":true,
			"hits--is-loading":this.isLoading()
		})
		return (
			<div className={className}>
				{_.map(hits, this.renderResult.bind(this))}
      </div>
		);
	}
}
