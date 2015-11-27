import * as React from "react";
import ESClient from "../../../../domain/ESClient.ts";
import * as _ from "lodash";
import * as classNames from 'classnames';

import PaginationAccessor from "../../../../domain/accessors/PaginationAccessor.ts";

require("./../styles/index.scss");

interface IPagination {
	searcher:ESClient;
}

enum DIRECTION {
	NEXT,
	PREVIOUS
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

	getCurrentPage():number {
		return Number(this.accessor.state.get()) || 1;
	}

	setPage(direction:DIRECTION) {
		if (this.isDisabled(direction)) { return };
		let currentPage:number = this.getCurrentPage();

		if (direction == DIRECTION.PREVIOUS) {
			this.accessor.state.set(currentPage-1);
		} else if (direction == DIRECTION.NEXT) {
			this.accessor.state.set(currentPage+1);
		}
		this.accessor.search();
		window.scrollTo(0,0);
	}

	isDisabled(direction:DIRECTION):boolean {
		let currentPage:number = this.getCurrentPage();
		let totalPages:number = Math.ceil(
			_.get(this.props.searcher,"results.hits.total",1)
			/
			_.get(this.props.searcher, "query.size", 10)
		)

		if (direction == DIRECTION.PREVIOUS && currentPage == 1) { return true; }
		if (direction == DIRECTION.NEXT && currentPage == totalPages ) { return true; }
		return false;
	}

	paginationElement(direction:DIRECTION, cssClass:string, displayText:string ) {
		let className = classNames({
			["pagination-navigation__"+cssClass]:true,
			"pagination-nav-item": true,
			"pagination-nav-item--disabled": this.isDisabled(direction)
		})
    return (
      <div onClick={this.setPage.bind(this,direction)} className={className}>
        <div className="pagination-nav-item__text">{displayText}</div>
      </div>    )
	}

  render() {
    return (
      <div className="pagination-navigation">
					{this.paginationElement(DIRECTION.PREVIOUS, "prev", "Previous")}
					{this.paginationElement(DIRECTION.NEXT, "next", "Next")}
      </div>
    )
  }
}
