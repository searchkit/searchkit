import * as React from "react"

import {
  SearchkitComponentProps
} from "../../../../core"

import { TagFilter } from "./TagFilter"

export interface TagFilterListProps extends SearchkitComponentProps {
  field: string
  values: [string]
  children?: React.ReactChildren
}

const map = require("lodash/map")

export class TagFilterList extends React.Component<TagFilterListProps, any> {

  render() {
    const { field, values, searchkit } = this.props

    return (
      <div className="sk-tag-filter-list">
        {map(values, value => <TagFilter key={value} field={field} value={value} searchkit={searchkit} />)}
      </div>
    )
  }
}
