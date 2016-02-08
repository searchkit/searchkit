import * as React from "react";

import {
  SearchkitManager,
  SearchkitComponent,
  FacetAccessor,
  ISizeOption,
  SearchkitComponentProps,
  FastClick,
	ReactComponentType,
	ArrayState,
  PureRender
} from "../../../../../core"

import {FilterCheckboxItemComponent, FilterItemComponentProps} from "../../filter-item/src/FilterItem";

const defaults = require("lodash/defaults")
const map = require("lodash/map")
const isNumber = require("lodash/isNumber")


export interface RefinementListFilterDisplayProps {
    id:string
    title:string
    hasOptions:boolean
    state:ArrayState
    toggleFilter:(string) => void
    translate:Function
    bemBlocks:any
    buckets:Array<any>
    moreSizeOption:any
    toggleViewMoreOption:Function
    itemComponent: ReactComponentType<FilterItemComponentProps>
}

@PureRender
export class RefinementListFilterDisplay extends React.Component<RefinementListFilterDisplayProps, any> {

  static defaultProps = {
    itemComponent: FilterCheckboxItemComponent
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
    const { itemComponent, bemBlocks, state, toggleFilter, translate } = this.props

    return React.createElement(itemComponent, {
      key: option.key,
      label: translate(option.key),
      count: option.doc_count,
      selected: state.contains(option.key),
      translate,
      bemBlocks,
      toggleFilter: () => toggleFilter(option.key)
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
  itemComponent?: ReactComponentType<FilterItemComponentProps>
  orderKey?:string
  orderDirection?:string
}

export class RefinementListFilter extends SearchkitComponent<RefinementListFilterProps, any> {
  accessor:FacetAccessor

  static propTypes = defaults({
    field:React.PropTypes.string.isRequired,
    operator:React.PropTypes.oneOf(["AND", "OR"]),
    size:React.PropTypes.number,
    title:React.PropTypes.string.isRequired,
    id:React.PropTypes.string.isRequired,
    translations:SearchkitComponent.translationsPropType(
      FacetAccessor.translations
    ),
    orderKey:React.PropTypes.string,
    orderDirection:React.PropTypes.oneOf(["asc", "desc"])
  }, SearchkitComponent.propTypes)

  static defaultProps = {
    component: RefinementListFilterDisplay,
    itemComponent: FilterCheckboxItemComponent
  }

  defineAccessor() {
    const {
      field, id, operator, title,
      size=50, translations, orderKey, orderDirection
    } = this.props
    return new FacetAccessor(field,{
      id, operator,title, size,
      translations, orderKey, orderDirection
    })
}

  defineBEMBlocks() {
    var blockName = this.props.mod || "sk-refinement-list"
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
      toggleFilter: this.toggleFilter.bind(this),
      moreSizeOption:this.accessor.getMoreSizeOption(),
      toggleViewMoreOption:this.toggleViewMoreOption.bind(this),
      translate:this.translate,
      state:this.accessor.state
    });
  }
}
