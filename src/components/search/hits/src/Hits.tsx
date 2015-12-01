import * as React from "react";
import * as _ from "lodash";
import SearchkitComponent from "../../../SearchkitComponent.ts";

require("./../styles/index.scss");

interface IHits {
	hitsPerPage: number
}

export default class Hits extends SearchkitComponent<IHits, any> {

	renderResult(result:any) {
		return (
			<div className="hit" key={result._id}>
				<img className="hit__poster" src={"/assets/"+result._source.imagePath}/>
				<div className="hit__title">{result._source.title}</div>
			</div>
		)
	}

	render() {
		return (
			<div className="hits">
				{_.map(_.get(this.searcher,"results.hits.hits", {}), this.renderResult)}
      </div>
		);
	}
}
