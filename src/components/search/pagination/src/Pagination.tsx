import * as React from "react";
import * as PropTypes from "prop-types";

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
  Toggle, ListProps, Select
} from "../../../ui"

import {defaults} from "lodash"
import {get} from "lodash"
import {assign} from "lodash"
import {map} from "lodash"
import {compact} from "lodash"
import {isNaN} from "lodash"
const bem = require("bem-cn")

import { Paginator } from "./PaginationUtils"

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
    pageScope: PropTypes.number,
    showNumbers:PropTypes.bool,
    showText:PropTypes.bool,
    showLast:PropTypes.bool,
  }, SearchkitComponent.propTypes)

  static defaultProps = {
    listComponent: Toggle,
    pageScope: 3,
    showNumbers: false,
    showText: true,
    showLast: false,
    mod: "sk-pagination-navigation"
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
      get(this.getResults(), "hits.total", 1)
      /
      get(this.getQuery(), "query.size", 10)
    );
  }

  isDisabled(pageNumber: number): boolean {
    return isNaN(pageNumber) || (pageNumber < 1) || (pageNumber > this.getTotalPages());
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
      showNumbers, pageScope, showText
    } = this.props
    const currentPage = this.getCurrentPage()
    const totalPages = this.getTotalPages()

    const builder =  Paginator.build({
      showNumbers, showFirst: true,
      showPrevious: showText, showNext: showText, showEllipsis: showText
    })
    return builder(currentPage, totalPages, this.translate, pageScope)
  }

  render() {
    if (!this.hasHits()) return null;
    const className = bem(this.props.mod).state({numbered:this.props.showNumbers})

    const view = renderComponent(this.props.listComponent, {
      items: this.getPages(),
      selectedItems: [this.getCurrentPage()],
      toggleItem:this.setPage,
      setItems:(items) => {
        if (items && items.length > 0) this.setPage(items[0])
      },
      disabled: this.getTotalPages() <= 1
    })

    return <div className={className}>{view}</div>

  }
}

export class PaginationSelect extends Pagination {
    static defaultProps = defaults({
        listComponent: Select,
        mod: 'sk-pagination-select',
        showNumbers: true,
        showText: false
    }, Pagination.defaultProps)
}
