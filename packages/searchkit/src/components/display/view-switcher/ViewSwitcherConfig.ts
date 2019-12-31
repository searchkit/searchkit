import * as PropTypes from 'prop-types'

import {
  SearchkitComponent,
  SearchkitComponentProps,
  ViewOptionsAccessor,
  RenderComponentType,
  RenderComponentPropType
} from '../../../core'

import { HitItemProps, HitsListProps } from '../../'
const defaults = require('lodash/defaults')

export interface ViewSwitcherConfigProps extends SearchkitComponentProps {
  hitComponents: Array<{
    key: string
    title: string
    itemComponent?: RenderComponentType<HitItemProps>
    listComponent?: RenderComponentType<HitsListProps>
    defaultOption?: boolean
  }>
}

export class ViewSwitcherConfig extends SearchkitComponent<ViewSwitcherConfigProps, any> {
  accessor: ViewOptionsAccessor

  static propTypes = defaults(
    {
      hitComponents: PropTypes.arrayOf(
        PropTypes.shape({
          key: PropTypes.string.isRequired,
          title: PropTypes.string.isRequired,
          itemComponent: RenderComponentPropType,
          listComponent: RenderComponentPropType,
          defaultOption: PropTypes.bool
        })
      )
    },
    SearchkitComponent.propTypes
  )

  defineAccessor() {
    return new ViewOptionsAccessor('view', this.props.hitComponents)
  }
  render() {
    return null
  }
}
