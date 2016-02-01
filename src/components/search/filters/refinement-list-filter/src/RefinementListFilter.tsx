import * as React from "react";
import "../styles/index.scss";

import {
  SearchkitManager,
  SearchkitComponent,
  FacetAccessor,
  ISizeOption,
  SearchkitComponentProps,
  FastClick
} from "../../../../../core"

import { ArrayState } from "../../../../../core/state"
import { ReactComponentType } from "../../../../../core/react"

const defaults = require("lodash/defaults")
const map = require("lodash/map")
const isNumber = require("lodash/isNumber")


export interface RefinementListItem {
  key: string
  doc_count: number
}

export interface RefinementListFilterItemProps {
  itemKey: string
  docCount: number
  selected: boolean
  translate: Function
  bemBlocks: any
  toggleFilter: (string) => void
}

export interface RefinementListFilterItemState { }

export class RefinementListFilterItem extends React.Component<RefinementListFilterItemProps, RefinementListFilterItemState> {

  constructor() {
    super()
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(){
    const { itemKey, toggleFilter } = this.props
    toggleFilter(itemKey)
  }

  render() {
    const { itemKey, docCount, bemBlocks, selected, translate } = this.props
    let block = bemBlocks.option

    let optionClassName = block()
      .mix(bemBlocks.container("item"))
      .state({ selected })

    return (
      <FastClick handler={this.handleClick}>
        <div className={optionClassName} data-qa="option">
          <div data-qa="checkbox" className={block("checkbox").state({ selected }) }></div>
          <div data-qa="label" className={block("text") }>{translate(itemKey) }</div>
          <div data-qa="count" className={block("count") }>{docCount}</div>
        </div>
      </FastClick>
    )
  }
}

export interface RefinementListFilterDisplayProps {
    id:string
    title:string
    hasOptions:boolean
    selected:ArrayState
    toggleFilter:(string) => void
    translate:Function
    bemBlocks:any
    buckets:Array<any>
    moreSizeOption:any
    toggleViewMoreOption:Function
    itemComponent: ReactComponentType<RefinementListFilterItemProps>
}

export interface RefinementListFilterDisplayState { }

export class RefinementListFilterDisplay extends React.Component<RefinementListFilterDisplayProps, RefinementListFilterDisplayState> {

  static defaultProps = {
    itemComponent: RefinementListFilterItem
  }

  hasOptions():boolean {
    return this.props.buckets.length != 0
  }

  render() {

    const { id, title, bemBlocks, buckets } = this.props

    let block = bemBlocks.container
    let className = block()
      .mix(`filter--${id}`)
      .state({
        disabled: !this.hasOptions()
      })

    return (
      <div data-qa={`filter--${this.props.id}`} className={className}>
        <div data-qa="header" className={block("header")}>{title}</div>
        <div data-qa="options" className={block("options")}>
          {map(buckets, this.renderOption.bind(this))}
        </div>
        {this.renderShowMore()}
      </div>
    );
  }

  renderOption(option) {
    const { itemComponent, bemBlocks, selected, toggleFilter, translate } = this.props

    return React.createElement(itemComponent, {
      key: option.key,
      itemKey: option.key,
      docCount: option.doc_count,
      selected: selected.contains(option.key),
      translate,
      bemBlocks,
      toggleFilter
    });
  }

  renderShowMore() {

    const { bemBlocks, moreSizeOption, toggleViewMoreOption, translate } = this.props

    let option = moreSizeOption

    if (!option) {
      return null;
    }

    return (
      <FastClick handler={() => toggleViewMoreOption(option) }>
        <div data-qa="show-more" className={bemBlocks.container("view-more-action") }>
          {translate(option.label) }
          </div>
        </FastClick>
    )
  }
}


export interface RefinementListFilterProps extends SearchkitComponentProps {
  field:string
  operator?:string
  size?:number
  title:string
  id:string
  component?: ReactComponentType<RefinementListFilterDisplayProps>
  itemComponent?: ReactComponentType<RefinementListFilterItemProps>
}

export class RefinementListFilter extends SearchkitComponent<RefinementListFilterProps, any> {
  accessor:FacetAccessor

  constructor() {
    super()
    this.toggleFilter = this.toggleFilter.bind(this)
    this.toggleViewMoreOption = this.toggleViewMoreOption.bind(this)
  }

  static propTypes = defaults({
    field:React.PropTypes.string.isRequired,
    operator:React.PropTypes.oneOf(["AND", "OR"]),
    size:React.PropTypes.number,
    title:React.PropTypes.string.isRequired,
    id:React.PropTypes.string.isRequired,
    translations:SearchkitComponent.translationsPropType(
      FacetAccessor.translations
    )
  }, SearchkitComponent.propTypes)

  static defaultProps = {
    component: RefinementListFilterDisplay,
    itemComponent: RefinementListFilterItem
  }

  defineAccessor() {
    return new FacetAccessor( this.props.field,{
      id:this.props.id, operator:this.props.operator,
      title:this.props.title, size:(this.props.size || 50),
      translations:this.props.translations
    })
  }

  defineBEMBlocks() {
    var blockName = this.props.mod || "refinement-list"
    return {
      container: blockName,
      option: `${blockName}-option`
    }
  }

  toggleFilter(key) {
    this.accessor.state = this.accessor.state.toggle(key)
    this.searchkit.performSearch()
  }

  toggleViewMoreOption(option:ISizeOption) {
    this.accessor.setViewMoreOption(option);
    this.searchkit.performSearch()
  }

  render() {
    const { id, title, component, itemComponent } = this.props;

    return React.createElement(component, {
      id,
      title,
      itemComponent,
      bemBlocks: this.bemBlocks,
      buckets:this.accessor.getBuckets(),
      toggleFilter: this.toggleFilter,
      moreSizeOption:this.accessor.getMoreSizeOption(),
      toggleViewMoreOption:this.toggleViewMoreOption,
      translate:this.translate.bind(this),
      selected:this.accessor.state,
    });
  }
}
