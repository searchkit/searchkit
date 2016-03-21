import * as React from "react";

import {
SearchkitComponent,
SearchkitComponentProps,
FastClick,
} from "../../../../core"



export interface TagFilterProps extends SearchkitComponentProps {
  field: string
  value: string
  children?: React.ReactChildren
}


export class TagFilter extends SearchkitComponent<TagFilterProps, any> {

  constructor(){
    super()
    this.handleClick = this.handleClick.bind(this)
  }
  
  isActive(){
    const { field, value } = this.props
    const accessor = this.searchkit.accessors.statefulAccessors[field]
    if (!accessor) {
      console.warn('Missing accessor for', field, 'in TagFilter, add TagFilterConfig if needed')
      return false
    }
    return accessor.state.contains(value)
  }

  handleClick() {
    const { field, value } = this.props
    const accessor = this.searchkit.accessors.statefulAccessors[field]
    if (!accessor) {
      console.error('Missing accessor for', field, 'in TagFilter, add TagFilterConfig if needed')
      return
    }
    accessor.state = accessor.state.toggle(value)
    this.searchkit.performSearch()
  }

  render() {
    const { value, children } = this.props
    
    var className = "sk-tag-filter"
    if (this.isActive()) className += " is-active"
    
    if (children){
      return (
        <FastClick handler={this.handleClick}>
          <div key={value} className={className}>{this.props.children}</div>
        </FastClick>
      )
    } else {
      // No children, use the value instead
      return (
        <FastClick handler={this.handleClick}>
          <div key={value} className={className}>{value}</div>
        </FastClick>
      )
    }
  }
}
