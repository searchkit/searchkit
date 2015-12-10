import * as React from "react";
import * as _ from "lodash";
import * as classNames from 'classnames';

import {
	SearchkitComponent,
	PaginationAccessor,
	FastClick
} from "../../../../core"

export interface IPagination {
}

export enum DIRECTION {
	NEXT,
	PREVIOUS
}

export class Pagination extends SearchkitComponent<IPagination, any> {
	accessor:PaginationAccessor

	defineAccessor(){
    return new PaginationAccessor("p")
	}

  hasPagination():boolean {
    // return !!this.searcher.stateManager.getData()
		return true
  }

	getCurrentPage():number {
		return Number(this.accessor.state.getValue()) || 1;
	}

	setPage(direction:DIRECTION) {
		if (this.isDisabled(direction)) { return };
		let currentPage:number = this.getCurrentPage();
		if (direction == DIRECTION.PREVIOUS) {
			this.accessor.state = this.accessor.state.setValue(currentPage-1);
		} else if (direction == DIRECTION.NEXT) {
			this.accessor.state = this.accessor.state.setValue(currentPage+1);
		}
		this.searchkit.performSearch();
		window.scrollTo(0,0);
	}

	isDisabled(direction:DIRECTION):boolean {
		let currentPage:number = this.getCurrentPage();
		let totalPages:number = Math.ceil(
			_.get(this.searcher,"results.hits.total",1)
			/
			_.get(this.searcher, "query.query.size", 10)
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
			<FastClick handler={this.setPage.bind(this,direction)}>
	      <div className={className}>
	        <div className="pagination-nav-item__text">{displayText}</div>
	      </div>
			</FastClick>
		)
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
