import * as React from "react";
import ESClient from "../../../../domain/ESClient.ts";
import * as _ from "lodash";
import * as classNames from 'classnames';

import PaginationAccessor from "../../../../domain/accessors/FacetAccessor.ts";


require("./../styles/index.scss");

interface IPagination {
	searcher:ESClient;
}

export default class Pagination extends React.Component<IPagination, any> {
	accessor:PaginationAccessor

	constructor(props:IPagination) {
		super(props)
    this.accessor = this.props.searcher.stateManager.registerAccessor(
      new PaginationAccessor("p")
    )
	}

  hasPagination():boolean {
    return !!this.props.searcher.stateManager.getData()
  }

  paginationPrevious() {
    return (
      <div className="pagination-navigation__previous pagination-nav-item pagination-nav-item--disabled">
        <div className="pagination-nav-item__text"> Previous</div>
      </div>
    )
  }

	paginationNext() {
    return (
      <div className="pagination-navigation__next pagination-nav-item">
        <div className="pagination-nav-item__text">Next </div>
      </div>    )
	}

  render() {
    return (
      <div className="pagination-navigation">
					{this.paginationPrevious()}
          {this.paginationNext()}
      </div>
    )
  }
}
