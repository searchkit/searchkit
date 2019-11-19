import * as PropTypes from "prop-types";
import * as React from 'react';

import {
	SearchkitComponent,
	SortingAccessor,
	SearchkitComponentProps,
	SortingOption,
	renderComponent,
	RenderComponentType,
	RenderComponentPropType
} from "../../../../core"

import {
	Select, ListProps
} from "../../../ui"

const defaults = require("lodash/defaults")

export interface SortingProps extends SearchkitComponentProps {
  options:Array<SortingOption>
  listComponent?: RenderComponentType<ListProps>
}

export class SortingSelector extends SearchkitComponent<SortingProps, any> {
  accessor:SortingAccessor

  static propTypes = defaults({
    listComponent: RenderComponentPropType,
    options:PropTypes.arrayOf(
      PropTypes.shape({
        label:PropTypes.string.isRequired,
        field:PropTypes.string,
        order:PropTypes.string,
        defaultOption:PropTypes.bool
      })
    )
  }, SearchkitComponent.propTypes)

  static defaultProps = {
    listComponent: Select
  }

  defineAccessor() {
    return new SortingAccessor("sort", {options:this.props.options})
  }

  toggleItem(key) {
    this.accessor.state = this.accessor.state.setValue(key);
    this.searchkit.performSearch();
  }

	setItems(keys){
		this.toggleItem(keys[0])
	}

  render(): React.ReactElement<any> {
    if (!this.accessor) return null;
    const { listComponent } = this.props
		const options = this.accessor.options.options
    const selected = [this.accessor.getSelectedOption().key]
    const disabled = !this.hasHits()

    return renderComponent(listComponent, {
			mod:this.props.mod,
			className:this.props.className,
      items: options,
      selectedItems: selected,
      setItems: this.setItems.bind(this),
      toggleItem: this.toggleItem.bind(this),
      disabled: disabled,
      urlBuilder: (item) => this.accessor.urlWithState(item.key),
			translate:this.translate
    })
  }
}
