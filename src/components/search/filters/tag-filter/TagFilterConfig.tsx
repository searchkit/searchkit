import * as React from "react";

import { 
  SearchkitComponent, SearchkitComponentProps, FacetAccessor 
} from "../../../../core"

export interface TagFilterConfigProps extends SearchkitComponentProps {
  field: string
  title: string
  id: string
  operator?: string
}

export class TagFilterConfig extends SearchkitComponent<TagFilterConfigProps, {}> {
  accessor: FacetAccessor

  defineAccessor() {
    const {
      field, id, operator, title
    } = this.props

    return new FacetAccessor(field, {
      id, operator, title, size: 1, loadAggregations: false
    })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.operator != this.props.operator) {
      this.accessor.options.operator = this.props.operator
      this.searchkit.performSearch()
    }
  }
  
  render(){
    return null
  }
}
