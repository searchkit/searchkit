import * as React from "react";
import * as _ from "lodash";
import SearchkitComponent from "../../../SearchkitComponent.ts";

require("./../styles/index.scss");

export interface IHits {
	hitsPerPage: number
	render:string
}

export default class Hits extends SearchkitComponent<IHits, any> {

	renderResult(result:any) {
		if (_.get(this.props, "render") == "movies") {
			return (
				<div className="hit" key={result._id}>
					<img className="hit__poster" src={result._source.poster}/>
					<div className="hit__title">{result._source.title}</div>
				</div>
			)
		}
		return (
			<div className="hit" key={result._id}>
				<img className="hit__poster" src={"/assets/"+result._source.imagePath}/>
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
