import {
	SearchkitComponent,
	SearchkitComponentProps,
	ViewOptionsAccessor,
	RenderComponentType,
	RenderComponentPropType,
	renderComponent
} from "../../../core"

import {Toggle, ListProps} from "../../ui"

const defaults = require("lodash/defaults")


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
				translate:this.translate
			})
    }
    return null

  }

}
