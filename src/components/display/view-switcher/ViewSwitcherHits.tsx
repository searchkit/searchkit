import * as React from "react";
import {defaults} from "lodash"

import {
	SearchkitComponent,
	SearchkitComponentProps,
	ViewOptionsAccessor,
	RenderComponentType,
	RenderComponentPropType
} from "../../../core"

import {
	Hits, HitsProps, HitItemProps, HitsListProps
} from "../../"

export interface ViewSwitcherHitsProps extends HitsProps {
	hitComponents:[{
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
		hitComponents:React.PropTypes.arrayOf(
			React.PropTypes.shape({
				key:React.PropTypes.string.isRequired,
				title:React.PropTypes.string.isRequired,
				itemComponent:RenderComponentPropType,
				listComponent:RenderComponentPropType,
				defaultOption:React.PropTypes.bool
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
