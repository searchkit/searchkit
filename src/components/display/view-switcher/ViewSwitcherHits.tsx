import * as React from "react";
const omit = require("lodash/omit")
import {
	SearchkitComponent,
	SearchkitComponentProps,
	ViewOptionsAccessor
} from "../../../core"

import {Hits} from "../../"

export class ViewSwitcherHits extends SearchkitComponent<any, any> {
  accessor:ViewOptionsAccessor

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
