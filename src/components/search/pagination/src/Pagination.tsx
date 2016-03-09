import * as React from "react";

import {
  SearchkitComponent,
  PaginationAccessor,
  FastClick,
  SearchkitComponentProps,
  PureRender,
  RenderComponentType,
  RenderComponentPropType,
  renderComponent
} from "../../../../core"

import {
  Toggle, ListProps
} from "../../../ui"


const defaults = require("lodash/defaults")
const get = require("lodash/get")
const assign = require("lodash/assign")
const map = require("lodash/map")
const compact = require("lodash/compact")

export interface PaginationProps extends SearchkitComponentProps {
  listComponent?: any
  pageScope?: number // Number of page to show before/after the current number
  showNumbers?: boolean
  showText?:boolean
  showLast?:boolean
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
    listComponent: RenderComponentPropType,
    pageScope: React.PropTypes.number,
    showNumbers:React.PropTypes.bool,
    showText:React.PropTypes.bool,
    showLast:React.PropTypes.bool,
  }, SearchkitComponent.propTypes)

  static defaultProps = {
    listComponent: Toggle,
    pageScope: 3,
    showNumbers: true,
    showText: true,
    showLast: false,
  }
  
  constructor(props){
    super(props)
    
    this.setPage = this.setPage.bind(this)
  }

  defineAccessor() {
    return new PaginationAccessor("p")
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

  normalizePage(page: (number | string)):number {
    if (page === 'previous') return this.getCurrentPage() - 1;
    else if (page === 'next') return this.getCurrentPage() + 1;
    else return +page
  }

  setPage(page:(number|string)) {
    const pageNumber:number = this.normalizePage(page)
    if (this.isDisabled(pageNumber)) { return };
    if (pageNumber == this.getCurrentPage()) {
      return; // Same page, no need to rerun query
    }
    this.accessor.state = this.accessor.state.setValue(pageNumber);
    this.searchkit.performSearch();
  }

  getPages() {
    const {
      showNumbers, pageScope, showText, showLast
    } = this.props

    var pages = []
    const showNext = showText
    const showPrevious = showText
    const currentPage = this.getCurrentPage()
    const totalPages = this.getTotalPages()

    if (showPrevious) pages.push({
      key: "previous",
      page: currentPage > 1 ? (currentPage - 1) : undefined,
      label: this.translate('pagination.previous'),
      disabled: currentPage === 1
    })
    if (showNumbers){
      if (currentPage > pageScope + 1) pages.push({ key: 1, label: '1', page: 1 })
      if (showText && currentPage > pageScope + 2) pages.push({ key: "ellipsis-first", label: '...', disabled: true })
      if (currentPage > 1) {
        const min = Math.max(1, currentPage - pageScope)
        for (let i = min; i < currentPage; i++) pages.push({ key: i, label: '' + i, page: i })
      }
      pages.push({ key: currentPage, label: '' + currentPage, page: currentPage, active: true })
      if (currentPage < totalPages) {
        const max = Math.min(currentPage + pageScope, totalPages)
        for (let i = currentPage + 1; i <= max; i++) pages.push({ key: i, label: '' + i, page: i })
      }
      const lastEllipsisLimit = showLast ? (totalPages - pageScope - 1) : (totalPages - pageScope)
      if (showText && currentPage < lastEllipsisLimit) pages.push({ key: "ellipsis-last", label: '...', disabled: true })
      if (showLast && (currentPage < totalPages - pageScope)) pages.push({ key: totalPages, label: '' + totalPages, page: totalPages })
    }
    if (showNext) pages.push({
      key: "next",
      label: this.translate('pagination.next'),
      page: currentPage < totalPages - 1 ? (currentPage + 1) : undefined,
      disabled: currentPage === totalPages
    })

    return pages
  }


  render() {
    if (!this.hasHits()) return null;

    return renderComponent(this.props.listComponent, {
      items: this.getPages(),
      selectedItems: [this.getCurrentPage()],
      toggleItem:this.setPage,
      setItems:(items) => {
        if (items && items.length > 0) this.setPage(items[0])
      },
      disabled: this.getTotalPages() <= 1
    })
  }
}
