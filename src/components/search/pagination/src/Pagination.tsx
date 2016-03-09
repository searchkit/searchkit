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

import { generatePages } from "./PaginationUtils"

const defaults = require("lodash/defaults")
const get = require("lodash/get")
const assign = require("lodash/assign")
const map = require("lodash/map")
const compact = require("lodash/compact")



export interface PaginationDisplayProps {
  currentPage: number
  totalPages: number
  showNumbers?: boolean
  showText?:boolean
  pageScope?: number // Number of page to show before/after the current number
  listComponent?: RenderComponentType<ListProps>
  translate: (string) => string
  setPage: (number) => void,
}


@PureRender
export class PaginationDisplay extends React.Component<PaginationDisplayProps, any> {

  static propTypes = {
    currentPage: React.PropTypes.number.isRequired,
    totalPages: React.PropTypes.number.isRequired,
    showNumbers: React.PropTypes.bool,
    showText:React.PropTypes.bool,
    pageScope: React.PropTypes.number,
    setPage: React.PropTypes.func,
    listComponent: React.PropTypes.any
  }

  static defaultProps = {
    showNumbers: false,
    pageScope: 3,
    listComponent: Toggle,
    showText:true
  }

  getPages(){
    const { showNumbers, currentPage, totalPages, pageScope } = this.props

    const options = { showNumbers, pageScope, showLast: false }
    return generatePages(currentPage, totalPages, options);
  }

  render() {
    const { translate, setPage, listComponent, currentPage, totalPages, showText } = this.props;

    const items = compact(map(this.getPages(), (p, idx) => {
      switch (p.type) {
        case 'number': return {
          key: p.page,
          label: '' + p.page,
          page: p.page,
          disabled: false
        }
        case 'ellipsis': return showText && {
          key: 'ellipsis-' + idx,
          label: '...',
          page: undefined,
          disabled: true
        }
        case 'previous':  // continue
        case 'next': return showText && {
          key: p.type,
          label: translate('pagination.' + p.type),
          page: p.page,
          disabled: p.disabled
        }
      }
    }))
    return renderComponent(listComponent, {
      items,
      selectedItems: [currentPage],
      toggleItem:setPage,
      setItems:(items)=> setPage(items[0]),
      disabled: totalPages <= 1
    })
  }
}


export interface PaginationProps extends SearchkitComponentProps {
  showNumbers?: boolean
  pageScope?: number // Number of page to show before/after the current number
  listComponent?: any
  showText?:boolean
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
    showNumbers:React.PropTypes.bool,
    showText:React.PropTypes.bool,
    pageScope: React.PropTypes.number,
    listComponent: RenderComponentPropType,
  }, SearchkitComponent.propTypes)

  static defaultProps = {
    listComponent: Toggle
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

  render() {
    if (!this.hasHits()) return null;

    const { showNumbers, pageScope, listComponent, showText } = this.props;
    return <PaginationDisplay
              listComponent={listComponent}
              currentPage = { this.getCurrentPage() }
              totalPages={this.getTotalPages()}
              showNumbers={showNumbers}
              showText={showText}
              pageScope={pageScope}
              translate={this.translate.bind(this)}
              setPage={this.setPage.bind(this)} />
  }
}
