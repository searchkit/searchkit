import * as React from "react";
import * as axios from "axios";

require("./../styles/index.scss");

export interface IAppProps {
	name: string;
}

export default class App extends React.Component<IAppProps, any> {

	componentDidMount() {
		axios.get("/test").then((response) => {
	    console.log(response);
	  })
	}


	render() {
		return (
			<div data-qa="test">
				<h1>testing fvdf, {this.props.name}!</h1>
				<div className="test">testing this backgjhkround</div>
			</div>
		);
	}
}
