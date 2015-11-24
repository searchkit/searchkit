import * as React from "react";

require("./../styles/index.scss");

interface ISearchBox {
	
}

export default class SearchBox extends React.Component<ISearchBox, any> {

	render() {
		return (
			<div className="query-input">
        <form>
          <div className="query-input__icon"></div>
          <input type="search" placeholder="search" className="query-input__text"/>
          <input type="submit" className="query-input__action"/>
        </form>
      </div>
		);
	}
}
