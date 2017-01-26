import * as React from 'react'

import {
  ReactComponentType,
  PureRender,
  FastClick,
} from "../../../"

let bemBlock = require("bem-cn")
import {size} from 'lodash'
import {toArray} from 'lodash'
import {map} from 'lodash'

export interface FilterGroupItemProps {
  key: string
  itemKey: string
  bemBlocks?: any
  label: string
  filter: any
  removeFilter: Function
}

@PureRender
export class FilterGroupItem extends React.Component<FilterGroupItemProps, any> {

  constructor(props){
    super(props)
    this.removeFilter = this.removeFilter.bind(this)
  }

  removeFilter(){
    const { removeFilter, filter } = this.props
    if (removeFilter){
      removeFilter(filter)
    }
  }

  render() {
    const { bemBlocks, label, itemKey } = this.props

    return (
      <FastClick handler={this.removeFilter}>
        <div className={bemBlocks.items("value") } data-key={itemKey}>{label}</div>
      </FastClick>
    )
  }
}

export interface FilterGroupProps {
  mod?: string
  className?: string
  title: string
  filters: Array<any>
  translate?: Function
  removeFilter: Function
  removeFilters: Function
}

export class FilterGroup extends React.Component<FilterGroupProps, any> {

  constructor(props){
    super(props)
    this.removeFilters = this.removeFilters.bind(this)
  }

  static defaultProps = {
    mod: "sk-filter-group",
    translate: (str) => str
  }

  removeFilters(){
    const { removeFilters, filters } = this.props
    if (removeFilters){
      removeFilters(filters)
    }
  }

  render() {
    const { mod, className, title, filters, removeFilters, removeFilter } = this.props

    const bemBlocks = {
        container: bemBlock(mod),
        items: bemBlock (`${mod}-items`)
    }

    return (
      <div key={title} className={bemBlocks.container().mix(className)}>
        <div className={bemBlocks.items()}>
          <div className={bemBlocks.items("title")}>{title}</div>
          <div className={bemBlocks.items("list")}>
            {map(filters, filter => this.renderFilter(filter, bemBlocks))}
          </div>
        </div>
        {this.renderRemove(bemBlocks)}
      </div>
    )
  }

  renderFilter(filter, bemBlocks) {
    const { translate, removeFilter } = this.props

    return (
      <FilterGroupItem key={filter.value}
                  itemKey={filter.value}
                  bemBlocks={bemBlocks}
                  filter={filter}
                  label={translate(filter.value)}
                  removeFilter={removeFilter} />
    )
  }

  renderRemove(bemBlocks){
    if (!this.props.removeFilters) return null

    return (
      <FastClick handler={this.removeFilters}>
        <div className={bemBlocks.container("remove-action") } onClick={this.removeFilters}>X</div>
      </FastClick>
    )
  }
}
