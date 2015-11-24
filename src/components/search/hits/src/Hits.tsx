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
				{JSON.stringify(result)}
			</div>
		)
	}

	render() {
		console.log(this.props.results)
		return (
			<div className="hits">
				{_.map(this.props.results, this.renderResult)}
      		</div>
		);
	}
}
