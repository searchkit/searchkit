import * as React from "react";
const omit = require("lodash/omit")
const defaults = require("lodash/defaults")

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

	constructor(props) {
		super(props)
	}

  defineAccessor(){
    return new ViewOptionsAccessor("view", this.props.hitComponents)
  }
  render(){
    let hitComponents = this.props.hitComponents
    let props = omit(this.props, "hitComponents")
    let selectedOption = this.accessor.getSelectedOption()
    props.itemComponent = selectedOption.itemComponent
		props.listComponent = selectedOption.listComponent
    props.mod = 'sk-hits-'+selectedOption.key
    return (
      <Hits {...props} />
    )
  }
}
