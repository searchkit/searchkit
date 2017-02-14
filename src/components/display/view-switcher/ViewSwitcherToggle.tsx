import * as React from "react";
import {
	SearchkitComponent,
	SearchkitComponentProps,
	ViewOptionsAccessor,
	RenderComponentType,
	RenderComponentPropType,
	renderComponent
} from "../../../core"

import {Hits} from "../../../"
import {Toggle, ListProps} from "../../ui"

import {defaults} from "lodash"


export interface ViewSwitcherProps extends SearchkitComponentProps {
	listComponent?:RenderComponentType<ListProps>
}

export class ViewSwitcherToggle extends SearchkitComponent<ViewSwitcherProps, any> {

	static defaultProps = {
		listComponent:Toggle
	}

	static propTypes = defaults({
		listComponent:RenderComponentPropType
	}, SearchkitComponent.propTypes)

  getViewOptionsSwitcherAccessor(){
    return this.searchkit.getAccessorByType(ViewOptionsAccessor)
  }

  setView(view){
    this.getViewOptionsSwitcherAccessor().setView(view)
  }

  render() {
    let viewOptionsAccessor = this.getViewOptionsSwitcherAccessor()
    if(viewOptionsAccessor){
      let options = viewOptionsAccessor.options
      let selectedOption = viewOptionsAccessor.getSelectedOption().key
			return renderComponent(this.props.listComponent, {
				mod:this.props.mod,
				className:this.props.className,
				disabled:!this.hasHits(),
				items:options,
				selectedItems:[selectedOption],
				toggleItem:this.setView.bind(this),
				setItems: ([item]) => this.setView(item),
				urlBuilder: (item) => this.getViewOptionsSwitcherAccessor().urlWithState(item.key),
				translate:this.translate
			})
    }
    return null

  }

}
