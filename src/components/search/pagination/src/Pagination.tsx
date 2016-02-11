import * as React from "react";

import {
  SearchkitComponent,
  PaginationAccessor,
  FastClick,
  SearchkitComponentProps,
  PureRender
} from "../../../../core"

const defaults = require("lodash/defaults")
const get = require("lodash/get")
const assign = require("lodash/assign")
const map = require("lodash/map")


// export enum DIRECTION {
//  NEXT,
//  PREVIOUS
// }

export function generatePages(currentPage, totalPages, options) {
  if (!options) options = {};
  const pageScope = options.pageScope == undefined ? 3 : options.pageScope;
  var pages = [];

  if (currentPage > pageScope + 1) pages.push({ type: "number", page: 1 })
  if (currentPage > pageScope + 2) pages.push({ type: "ellipsis" })
  if (currentPage > 1) {
    const min = Math.max(1, currentPage - pageScope)
    for (let i = min; i < currentPage; i++) pages.push({ type: "number", page: i })
  }
  pages.push({ type: "number", page: currentPage, active: true })
  if (currentPage < totalPages) {
    const max = Math.min(currentPage + pageScope, totalPages)
    for (let i = currentPage + 1; i <= max; i++) pages.push({ type: "number", page: i })
  }
  if (currentPage < totalPages - pageScope) pages.push({ type: "ellipsis" })

  return pages
}


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


@PureRender
export class PaginationDisplay extends React.Component<PaginationDisplayProps, any> {

  static propTypes = {
    currentPage: React.PropTypes.number.isRequired,
    totalPages: React.PropTypes.number.isRequired,
    urlBuilder: React.PropTypes.func.isRequired,
    showNumbers: React.PropTypes.bool,
    pageScope: React.PropTypes.number,
    setPage: React.PropTypes.func,
  }

  static defaultProps = {
    showNumbers: false,
    pageScope: 3
  }

  isDisabled(pageNumber: number): boolean {
    return (pageNumber < 1) || (pageNumber > this.props.totalPages);
  }

  getPages(){
    const { showNumbers, currentPage, totalPages, pageScope } = this.props;
    if (!showNumbers) return [];
    return generatePages(currentPage, totalPages, { pageScope });
  }

  render() {
    const { showNumbers, currentPage, pageScope, bemBlocks, totalPages } = this.props;
    const className = bemBlocks.container().state({
      numbered:this.props.showNumbers,
      disabled: totalPages == 1
    })
    // Renders numbers for pages, like "1, ..., 3, 4, 5, 6, 7, ..."
    return (
      <div className={className} data-qa="pagination">
        {this.renderPaginationElement(currentPage - 1, "prev", "pagination.previous") }
        {this.getPages().map(({type, page}, idx) => {
          if (type == "ellipsis") return this.renderEllipsis(idx)
          else return this.renderPaginationElement(page, "number")
        })}
        {this.renderPaginationElement(currentPage + 1, "next", "pagination.next") }
      </div>
    )
  }

  renderEllipsis(key){
    const { showNumbers, bemBlocks } = this.props;
    if (!showNumbers) return undefined;

    const className = bemBlocks.option()
      .mix(bemBlocks.container("item"))
      .mix(bemBlocks.option("number"))
      .state({
        disabled: true
      })
    return (
      <div key={"ellipsis-" + key} className={className}>
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
        <div key={"page-" + displayText} className={className}>
          <div className={bemBlocks.option("text") }>{displayText}</div>
        </div>
      )
    } else {
      return (
        <FastClick key={"page-" + displayText} handler={() => setPage(pageNumber) }>
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
    let block = (this.props.mod || "sk-pagination-navigation")
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
    return (pageNumber < 1) || (pageNumber > this.getTotalPages());
  }

  setPage(pageNumber:number) {
    if (this.isDisabled(pageNumber)) { return };
    if (pageNumber == this.getCurrentPage()) {
      return; // Same page, no need to rerun query
    }
    this.accessor.state = this.accessor.state.setValue(pageNumber);
    this.searchkit.performSearch();
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
