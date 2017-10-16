import * as React from "react";
import * as PropTypes from "prop-types"
const defaults = require("lodash/defaults")

import {
	SearchkitComponent,
	ViewOptionsAccessor,
	RenderComponentType,
	RenderComponentPropType
} from "../../../core"

import {
	Hits, HitsProps, HitItemProps, HitsListProps
} from "../../"

export interface ViewSwitcherHitsProps extends HitsProps {
	hitComponents?:[{
		key:string,
		title:string,
		itemComponent?:RenderComponentType<HitItemProps>,
		listComponent?:RenderComponentType<HitsListProps>,
		defaultOption?:boolean
	}]
}

export class ViewSwitcherHits extends SearchkitComponent<ViewSwitcherHitsProps, any> {
  accessor:ViewOptionsAccessor

	static propTypes = defaults({
		hitComponents:PropTypes.arrayOf(
			PropTypes.shape({
				key:PropTypes.string.isRequired,
				title:PropTypes.string.isRequired,
				itemComponent:RenderComponentPropType,
				listComponent:RenderComponentPropType,
				defaultOption:PropTypes.bool
			})
		)
	}, Hits.propTypes)

  defineAccessor(){
    return new ViewOptionsAccessor("view", this.props.hitComponents)
  }
  render(){
    const selectedOption = this.accessor.getSelectedOption()
    const props = {
      ...this.props,
      itemComponent: selectedOption.itemComponent,
      listComponent: selectedOption.listComponent,
      mod: 'sk-hits-'+selectedOption.key
    }
    return (
      <Hits {...props} />
    )
  }
}
