import * as React from "react";

require("./../styles/index.scss");

interface IRefinementListFilter {

}

export default class RefinementListFilter extends React.Component<IRefinementListFilter, any> {

	render() {
		return (
			<div className="refinement-list-filter">
        drill down filter
      </div>
		);
	}
}
