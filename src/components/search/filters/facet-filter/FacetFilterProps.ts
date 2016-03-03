import * as React from "react";

import {
  ReactComponentType, SearchkitComponentProps,
  SearchkitComponent, FacetAccessor
} from "../../../../core"

import {
  ItemProps, ListProps
} from "../../../"

const defaults = require("lodash/defaults")
export interface FacetFilterProps extends SearchkitComponentProps {
  field: string
  operator?: string
  size?: number
  title: string
  id: string
  containerComponent?: ReactComponentType<any>
  itemComponent?: ReactComponentType<ItemProps>
  listComponent?: ReactComponentType<ListProps>
  orderKey?: string
  orderDirection?: string
  include?: Array<string> | string
  exclude?: Array<string> | string
  collapsable?: boolean
  showCount?: boolean
  showMore?:boolean
}

export const FacetFilterPropTypes = defaults({
  field: React.PropTypes.string.isRequired,
  operator: React.PropTypes.oneOf(["AND", "OR"]),
  size: React.PropTypes.number,
  title: React.PropTypes.string.isRequired,
  id: React.PropTypes.string.isRequired,
  translations: SearchkitComponent.translationsPropType(
    FacetAccessor.translations
  ),
  orderKey: React.PropTypes.string,
  orderDirection: React.PropTypes.oneOf(["asc", "desc"]),
  include: React.PropTypes.oneOfType([
      React.PropTypes.string, React.PropTypes.array
  ]),
  exclude: React.PropTypes.oneOfType([
      React.PropTypes.string, React.PropTypes.array
  ]),
  collapsable: React.PropTypes.bool,
  showCount: React.PropTypes.bool,
  showMore: React.PropTypes.bool
},SearchkitComponent.propTypes)
