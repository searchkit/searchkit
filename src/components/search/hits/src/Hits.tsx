import * as React from "react";
import * as _ from "lodash";

require("./../styles/index.scss");

interface IHits {
	results:any
}

export default class Hits extends React.Component<IHits, any> {

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
				{_.map(this.props.results, this.renderResult)}
      		</div>
		);
	}
}
