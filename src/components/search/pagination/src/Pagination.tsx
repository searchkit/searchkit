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
const map = require("lodash/map")


// export enum DIRECTION {
//  NEXT,
//  PREVIOUS
// }

export interface PaginationDisplayProps {
  currentPage: number
  totalPages: number
  showNumbers?: boolean
  pageScope?: number // Number of page to show before/after the current number
  bemBlocks: any
  urlBuilder: (number) => string
  translate: (string) => string
  setPage: (number) => void
}

export interface PaginationDisplayState { }

export class PaginationDisplay extends React.Component<PaginationDisplayProps, PaginationDisplayState> {

  static propTypes = {
    currentPage: React.PropTypes.number.isRequired,
    totalPages: React.PropTypes.number.isRequired,
    urlBuilder: React.PropTypes.func.isRequired,
    showNumbers: React.PropTypes.bool,
    pageScope: React.PropTypes.number,
    setPage: React.PropTypes.func,
  }

  static defaultProps = {
    showNumbers: true,
    pageScope: 3
  }

  isDisabled(pageNumber: number): boolean {
    return (pageNumber < 1) || (pageNumber > this.props.totalPages);
  }

  render() {
    const { showNumbers, currentPage, pageScope, bemBlocks, totalPages } = this.props;
    // Renders numbers for pages, like "1, ..., 3, 4, 5, 6, 7, ..."
    return (
      <div className={bemBlocks.container() } data-qa="pagination">
        {this.renderPaginationElement(currentPage - 1, "prev", "pagination.previous") }
        {currentPage > pageScope + 1 ? this.renderPaginationElement(1, "number") : undefined}
        {currentPage > pageScope + 2 ? this.renderEllipsis() : undefined}
        {this.renderPageNumbers(currentPage - pageScope, currentPage - 1) }
        {this.renderPaginationElement(currentPage, "number", "" + currentPage) }
        {this.renderPageNumbers(currentPage + 1, currentPage + pageScope) }
        {currentPage < totalPages - pageScope ? this.renderEllipsis() : undefined}
        {this.renderPaginationElement(currentPage + 1, "next", "pagination.next") }
      </div>
    )
  }

  renderPageNumbers(min: number, max: number) {
    const { showNumbers, totalPages } = this.props;
    if (!showNumbers) return undefined;

    const minPage = Math.max(1, min);
    const maxPage = Math.min(totalPages, max);
    let arr = [];
    for (var i = minPage; i <= maxPage; i++) {
      arr.push(this.renderPaginationElement(i, "number"));
    }
    return arr;
  }

  renderEllipsis(){
    const { showNumbers, bemBlocks } = this.props;
    if (!showNumbers) return undefined;

    const className = bemBlocks.option()
      .mix(bemBlocks.container("item"))
      .mix(bemBlocks.option("number"))
      .state({
        disabled: true
      })
    return (
      <div className={className}>
        <div className={bemBlocks.option("text") }>...</div>
        </div>
    )
  }

  renderPaginationElement(pageNumber: number, cssClass: string, text?: string) {
    const { showNumbers, currentPage, bemBlocks, translate, setPage, urlBuilder } = this.props;

    // Block numbers ?
    if (!showNumbers && (cssClass == "number")) return undefined

    const disabled = this.isDisabled(pageNumber);
    const className = bemBlocks.option()
      .mix(bemBlocks.container("item"))
      .mix(bemBlocks.option(cssClass))
      .state({
        active: (pageNumber === currentPage),
        disabled
      })

          //  data-q={displayText}
    // previous/next or page number ?
    const displayText = text ? translate(text) : ("" + pageNumber);
    if (disabled){
      return (
        <div className={className}>
          <div className={bemBlocks.option("text") }>{displayText}</div>
        </div>
      )
    } else {
      return (
        <FastClick key={displayText} handler={() => setPage(pageNumber) }>
          <a className={className} href={urlBuilder(pageNumber) }>
            <div className={bemBlocks.option("text") }>{displayText}</div>
          </a>
        </FastClick>
      )
    }
  }
}


export interface PaginationProps extends SearchkitComponentProps {
  showNumbers?: boolean
  pageScope?: number // Number of page to show before/after the current number
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
    ),
    showNumbers:React.PropTypes.bool
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

  getCurrentPage():number {
    return Number(this.accessor.state.getValue()) || 1;
  }

  getTotalPages():number {
    return Math.ceil(
      get(this.getResults(), ".hits.total", 1)
      /
      get(this.getQuery(), "query.size", 10)
    );
  }

  isDisabled(pageNumber: number): boolean {
    return (pageNumber < 1) || (pageNumber >= this.getTotalPages());
  }

  setPage(pageNumber:number) {
    if (this.isDisabled(pageNumber)) { return };
    if (pageNumber == this.getCurrentPage()) {
      return; // Same page, no need to rerun query
    }
    this.accessor.state = this.accessor.state.setValue(pageNumber);
    this.searchkit.performSearch();
    window.scrollTo(0,0); // BUG, doesn't work for inner divs
  }

  render() {
    if (!this.hasHits()) return null;

    const { showNumbers, pageScope } = this.props;
    return <PaginationDisplay currentPage={this.getCurrentPage()}
                              totalPages={this.getTotalPages()}
                              showNumbers={showNumbers}
                              pageScope={pageScope}
                              bemBlocks={this.bemBlocks}
                              translate={this.translate.bind(this)}
                              urlBuilder={this.accessor.urlWithState}
                              setPage={this.setPage.bind(this)} />
  }
}
