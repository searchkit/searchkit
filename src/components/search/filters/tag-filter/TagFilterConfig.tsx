import * as React from "react";

import { RefinementListFilter } from "../facet-filter"

import { SearchkitComponentProps } from "../../../../core"

class NullComponent extends React.Component<{}, {}> {
  render(){return null}
}

export interface TagFilterConfigProps extends SearchkitComponentProps {
  field: string
  operator?: string
  size?: number
  title: string
  id: string
}

export class TagFilterConfig extends React.Component<TagFilterConfigProps, {}> {

  render() {
    return <RefinementListFilter {...this.props} size={0} containerComponent={NullComponent}/>
  }
}
