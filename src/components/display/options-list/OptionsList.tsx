import {Select, ListProps} from "../../ui"

import {
	SearchkitComponent,
	SearchkitComponentProps,
	ViewOptionsAccessor,
	RenderComponentType,
	RenderComponentPropType,
	renderComponent,
  OptionsListAccessor,
  OptionItem
} from "../../../core"

const defaults = require("lodash/defaults")

export interface OptionsListProps extends SearchkitComponentProps {
	listComponent?:RenderComponentType<ListProps>
  accessorId:string
  accessorProp:string
  options:Array<OptionItem>
  id:string

}

export class OptionsList extends SearchkitComponent<OptionsListProps, any> {
  accessor:OptionsListAccessor
	static defaultProps = {
		listComponent:Select
	}

	static propTypes = defaults({
		listComponent:RenderComponentPropType
	}, SearchkitComponent.propTypes)

  defineAccessor(){
    const {id, accessorId, accessorProp, options} = this.props
    return new OptionsListAccessor(
      id, {id, accessorId, accessorProp, options})
  }

  render() {
    let options = this.props.options
    let selectedOption = this.accessor.getSelectedOption()
		return renderComponent(this.props.listComponent, {
			mod:this.props.mod,
			className:this.props.className,
			disabled:!this.hasHits(),
			items:options,
			selectedItems:[selectedOption.key],
			toggleItem:(item)=> this.accessor.selectOption(item),
			setItems:([item])=> this.accessor.selectOption(item),
			translate:this.translate
		})
  }

}
