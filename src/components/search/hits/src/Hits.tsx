import * as React from "react";
import * as _ from "lodash";

require("./../styles/index.scss");

interface IHits {

}

export default class Hits extends React.Component<IHits, any> {
	results:Array<{}>;

	constructor(props:IHits) {
		super(props);
		this.results = [{id:"x", x:"x"}, {id:"y", x:"y"}]
	}

	renderResult(result:any) {
		return (
			<div className="hit" key={result.id}>
				{JSON.stringify(result)}
			</div>
		)
	}

	render() {
		return (
			<div className="hits">
				{_.map(this.results, this.renderResult)}
      </div>
		);
	}
}
