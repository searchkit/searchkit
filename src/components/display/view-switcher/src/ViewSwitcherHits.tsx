import * as React from "react";
const omit = require("lodash/omit")
const defaults = require("lodash/defaults")

import {
	SearchkitComponent,
	SearchkitComponentProps,
	ViewOptionsAccessor,
	ReactComponentType
} from "../../../../core"

import {Hits, HitsProps, HitItemProps} from "../../../"

export interface ViewSwitcherHitsProps extends HitsProps {
	hitComponents:[{
		key:string,
		title:string,
		itemComponent:ReactComponentType<HitItemProps>,
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
				itemComponent:React.PropTypes.func.isRequired,
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
    props.mod = 'sk-hits-'+selectedOption.key
    return (
      <Hits {...props} />
    )
  }
}
