import * as React from "react";

require("./../styles/index.scss");

interface IHitsStats {

}

export default class HitsStats extends React.Component<IHitsStats, any> {

	render() {
		return (
			<div className="hits-stats">
        search results summary
      </div>
		);
	}
}
