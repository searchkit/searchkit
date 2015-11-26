import * as React from "react";
import ESClient from "../../../../domain/ESClient.ts";
import ElasticAccessors from "../../../../domain/accessors/ElasticAccessors.ts"
import * as _ from "lodash";
import * as classNames from 'classnames';
import {StateAccessorRef} from "../../../../domain/StateAccessors.ts"

require("./../styles/index.scss");

interface IPagination {
	searcher:ESClient;
}

export default class Pagination extends React.Component<IPagination, any> {
	accessor:StateAccessorRef

	constructor(props:IPagination) {
		super(props)
	}

  hasPagination():boolean {
    return !!this.props.searcher.accessors.getData()
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
