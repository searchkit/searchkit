import * as _ from "lodash";
import * as React from "react";
import {
	SearchkitComponent,
} from "../../../../core"

require("./../styles/index.scss");

export interface IHits {
	hitsPerPage: number
}

export class Hits extends SearchkitComponent<IHits, any> {

	renderResult(result:any) {
		return (
			<div className="hit" key={result._id}>
				<img className="hit__poster" src={result._source.poster}/>
				<div className="hit__title">{result._source.title}</div>
			</div>
		)
	}

	render() {
		let hits:{}[] = _.get(this.searcher, "results.hits.hits", null)
		return (
			<div className="hits">
				{_.map(hits, this.renderResult.bind(this))}
      </div>
		);
	}
}
