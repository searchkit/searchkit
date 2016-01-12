import * as React from "react";
import * as _ from "lodash";
import "../styles/index.scss";

import {
	SearchkitComponent,
	PaginationAccessor,
	FastClick
} from "../../../../core"

export interface IPagination {
	mod?:string,
	prevLinkText?:string,
	nextLinkText?:string
}

export enum DIRECTION {
	NEXT,
	PREVIOUS
}

export class Pagination extends SearchkitComponent<IPagination, any> {
	accessor:PaginationAccessor

	defineAccessor() {
    return new PaginationAccessor("p")
	}

	defineBEMBlocks() {
		let block = (this.props.mod || "pagination-navigation")
		return {
			container: block,
			option: `${block}-item`
		}
	}

  hasPagination():boolean {
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
		let className = this.bemBlocks.option()
			.mix(this.bemBlocks.container("item"))
			.state({
				disabled:this.isDisabled(direction)
			})
    return (
			<FastClick handler={this.setPage.bind(this,direction)}>
	      <div className={className} data-qa={direction}>
	        <div className={this.bemBlocks.option("text")}>{displayText}</div>
	      </div>
			</FastClick>
		)
	}

  render() {
    return (
      <div className={this.bemBlocks.container()} data-qa="pagination">
					{this.paginationElement(DIRECTION.PREVIOUS, "prev", (this.props.prevLinkText || "Previous"))}
					{this.paginationElement(DIRECTION.NEXT, "next", (this.props.nextLinkText || "Next"))}
      </div>
    )
  }
}
