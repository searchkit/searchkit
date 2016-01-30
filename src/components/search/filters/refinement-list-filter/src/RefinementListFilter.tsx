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

import {
  ArrayState
} from "../../../../../core/state"

import {
  ReactComponentType
} from "../../../../../core/react"

const defaults = require("lodash/defaults")
const map = require("lodash/map")
const isNumber = require("lodash/isNumber")


export interface RefinementListFilterDisplayProps {
    id:string
    title:string
    hasOptions:boolean
    selected:ArrayState
    addFilter:Function
    translate:Function
    bemBlocks:any
    buckets:Array<any>
    moreSizeOption:any
    toggleViewMoreOption:Function
}

export interface RefinementListFilterDisplayState { }

export class RefinementListFilterDisplay extends React.Component<RefinementListFilterDisplayProps, RefinementListFilterDisplayState> {

  renderOption(option) {
    const { bemBlocks, selected, addFilter, translate } = this.props
    let block = bemBlocks.option
    let isSelected = selected.contains(option.key)

    let optionClassName = block()
      .mix(bemBlocks.container("item"))
      .state({selected:isSelected})

    return (
      <FastClick handler={() => addFilter(option)} key={option.key}>
        <div className={optionClassName} data-qa="option">
          <div data-qa="checkbox" className={block("checkbox").state({selected:isSelected})}></div>
          <div data-qa="label" className={block("text")}>{translate(option.key)}</div>
          <div data-qa="count" className={block("count")}>{option.doc_count}</div>
        </div>
      </FastClick>
    )
  }

  hasOptions():boolean {
    return this.props.buckets.length != 0
  }

  renderShowMore() {

    const { bemBlocks, moreSizeOption, toggleViewMoreOption, translate } = this.props

    let option = moreSizeOption

    if (!option) {
      return null;
    }

    return (
      <FastClick handler={() => toggleViewMoreOption(option)}>
        <div data-qa="show-more" className={bemBlocks.container("view-more-action")}>
          {translate(option.label)}
        </div>
      </FastClick>
    )
  }

  render() {

    const { id, title, bemBlocks, buckets } = this.props

    let block = bemBlocks.container
    let className = block()
      .mix(`filter--${id}`)
      .state({
        disabled: !this.hasOptions()
      })

     console.log('title', title, this.hasOptions(), buckets);

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
}


export interface RefinementListFilterProps extends SearchkitComponentProps {
  field:string
  operator?:string
  size?:number
  title:string
  id:string
  component?: ReactComponentType //React.ComponentClass<RefinementListFilterDisplayProps>
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
    )
  }, SearchkitComponent.propTypes)

  static defaultProps = {
    component: RefinementListFilterDisplay
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

  addFilter(option) {
    this.accessor.state = this.accessor.state.toggle(option.key)
    this.searchkit.performSearch()
  }

  toggleViewMoreOption(option:ISizeOption) {
    this.accessor.setViewMoreOption(option);
    this.searchkit.performSearch()
  }

  render() {
    const { id, title, component } = this.props;

    return React.createElement(component, {
      id,
      title,
      bemBlocks: this.bemBlocks,
      buckets:this.accessor.getBuckets(),
      addFilter:this.addFilter.bind(this),
      moreSizeOption:this.accessor.getMoreSizeOption(),
      toggleViewMoreOption:this.toggleViewMoreOption.bind(this),
      translate:this.translate.bind(this),
      selected:this.accessor.state,
    });
  }
}

export function RefinementListFilterWrapper<T>(component:React.ComponentClass<T>): React.ComponentClass<T & RefinementListFilterProps> {
  return class extends React.Component<T & RefinementListFilterProps, void> {
    render() {
      return <RefinementListFilter {...this.props} component={component} />;
    }
  };
}
