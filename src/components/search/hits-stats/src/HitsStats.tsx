import * as React from "react";
import ESClient from "../../../../domain/ESClient.ts";
import * as _ from "lodash";

require("./../styles/index.scss");

interface IHitsStats {
	searcher:ESClient
}

export default class HitsStats extends React.Component<IHitsStats, any> {

	getHitCount():number {
		return _.has(this.props.searcher, "results.hits.total") ? this.props.searcher.results.hits.total : 0;
	}

	render() {
		return (
			<div className="hits-stats">
				{this.getHitCount()} results
      </div>
		);
	}
}
