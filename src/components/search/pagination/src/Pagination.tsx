import * as React from "react";
import "../styles/index.scss";

import {
	SearchkitComponent,
	PaginationAccessor,
	FastClick,
	SearchkitComponentProps
} from "../../../../core"

const defaults = require("lodash/defaults")
const get = require("lodash/get")
const assign = require("lodash/assign")

export interface PaginationProps extends SearchkitComponentProps {
}

export enum DIRECTION {
	NEXT,
	PREVIOUS
}

export class Pagination extends SearchkitComponent<PaginationProps, any> {
	accessor:PaginationAccessor


	static translations:any = {
		"pagination.previous":"Previous",
		"pagination.next":"Next"
	}
	translations = Pagination.translations

	static propTypes = defaults({
		translations:SearchkitComponent.translationsPropType(
			Pagination.translations
		)
	}, SearchkitComponent.propTypes)

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
			get(this.getResults(),".hits.total",1)
			/
			get(this.getQuery(), "query.size", 10)
		)
		if (direction == DIRECTION.PREVIOUS && currentPage == 1) { return true; }
		if (direction == DIRECTION.NEXT && currentPage == totalPages ) { return true; }
		return false;
	}

	paginationElement(direction:DIRECTION, cssClass:string, displayText:string ) {
		let className = this.bemBlocks.option()
			.mix(this.bemBlocks.container("item"))
			.mix(this.bemBlocks.option(cssClass))
			.state({
				disabled:this.isDisabled(direction)
			})
    return (
			<FastClick handler={this.setPage.bind(this,direction)}>
	      <div className={className} data-qa={direction}>
	        <div className={this.bemBlocks.option("text")}>{this.translate(displayText)}</div>
	      </div>
			</FastClick>
		)
	}

  render() {
		if(this.hasHits()){
			return (
				<div className={this.bemBlocks.container()} data-qa="pagination">
					{this.paginationElement(DIRECTION.PREVIOUS, "prev", "pagination.previous")}
					{this.paginationElement(DIRECTION.NEXT, "next", "pagination.next")}
      	</div>
			)
		}
		return null
  }
}
