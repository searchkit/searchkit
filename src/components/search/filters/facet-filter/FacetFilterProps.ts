import * as React from "react";

import {
  ReactComponentType, SearchkitComponentProps,
  SearchkitComponent, FacetAccessor,
  RenderComponentPropType, RenderComponentType,
  FieldOptions
} from "../../../../core"

import {
  ItemProps, ListProps
} from "../../../"

import {defaults} from "lodash"
export interface FacetFilterProps extends SearchkitComponentProps {
  field: string
  operator?: string
  size?: number
  title: string
  id: string
  containerComponent?: RenderComponentType<any>
  itemComponent?: RenderComponentType<ItemProps>
  listComponent?: RenderComponentType<ListProps>
  orderKey?: string
  orderDirection?: string
  include?: Array<string> | string
  exclude?: Array<string> | string
  showCount?: boolean
  showMore?:boolean
  fieldOptions?:FieldOptions,
  countFormatter?:(count:number)=> number | string
  bucketsTransform?:Function
}

export const FacetFilterPropTypes = defaults({
  field: React.PropTypes.string.isRequired,
  operator: React.PropTypes.oneOf(["AND", "OR"]),
  size: React.PropTypes.number,
  title: React.PropTypes.string.isRequired,
  id: React.PropTypes.string.isRequired,
  containerComponent:RenderComponentPropType,
  listComponent:RenderComponentPropType,
  itemComponent:RenderComponentPropType,
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
  showCount: React.PropTypes.bool,
  showMore: React.PropTypes.bool,
  fieldOptions:React.PropTypes.shape({
    type:React.PropTypes.oneOf(["embedded", "nested", "children"]).isRequired,
    options:React.PropTypes.object
  }),
  countFormatter:React.PropTypes.func,
  bucketsTransform:React.PropTypes.func
},SearchkitComponent.propTypes)
