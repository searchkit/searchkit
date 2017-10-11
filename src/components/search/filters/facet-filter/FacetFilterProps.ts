import * as PropTypes from "prop-types";

import {
  SearchkitComponentProps,
  FacetAccessor,
  RenderComponentPropType, RenderComponentType,
  FieldOptions
} from "../../../../core"

import { SearchkitComponent } from "../../../../core/react"

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
  field: PropTypes.string.isRequired,
  operator: PropTypes.oneOf(["AND", "OR"]),
  size: PropTypes.number,
  title: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  containerComponent:RenderComponentPropType,
  listComponent:RenderComponentPropType,
  itemComponent:RenderComponentPropType,
  translations: SearchkitComponent.translationsPropType(
    FacetAccessor.translations
  ),
  orderKey: PropTypes.string,
  orderDirection: PropTypes.oneOf(["asc", "desc"]),
  include: PropTypes.oneOfType([
      PropTypes.string, PropTypes.array
  ]),
  exclude: PropTypes.oneOfType([
      PropTypes.string, PropTypes.array
  ]),
  showCount: PropTypes.bool,
  showMore: PropTypes.bool,
  fieldOptions:PropTypes.shape({
    type:PropTypes.oneOf(["embedded", "nested", "children"]).isRequired,
    options:PropTypes.object
  }),
  countFormatter:PropTypes.func,
  bucketsTransform:PropTypes.func
},SearchkitComponent.propTypes)
