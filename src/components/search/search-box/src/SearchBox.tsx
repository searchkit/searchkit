import * as React from "react";
import * as rx from "rx";

require("./../styles/index.scss");

interface ISearchBox {

}

export default class SearchBox extends React.Component<ISearchBox, any> {

	// constructor(props) {
	// 	super(props);
	// 	this.state = {
	// 		query:"j"
	// 	}
	// }

	onKeyDown() {
		console.log("hello", this.state.query)
	}

	render() {
		return (
			<div className="query-input">
      </div>
		);
	}
}
