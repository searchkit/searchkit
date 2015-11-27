import * as React from "react";
import * as _ from "lodash";

require("./../styles/index.scss");

interface IHits {
	searcher:any
	hitsPerPage: number
}

export default class Hits extends React.Component<IHits, any> {

	constructor(props:IHits) {
		super(props);
	}

	renderResult(result:any) {
		return (
			<div className="hit" key={result._id}>
				<img className="hit__poster" src={result._source.poster}/>
				<div className="hit__title">{result._source.title}</div>
			</div>
		)
	}

	render() {
		return (
			<div className="hits">
				{_.map(_.get(this.props.searcher,"results.hits.hits", {}), this.renderResult)}
      </div>
		);
	}
}
