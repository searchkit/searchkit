import * as React from "react";

import {
  SearchkitComponent,
  SearchkitComponentProps,
  CheckboxFilterAccessor,
  ReactComponentType,
  renderComponent
} from "../../../../core";

import {
  Panel, CheckboxItemList
} from "../../../ui"

import {defaults} from 'lodash'
import {map} from 'lodash'

export interface CheckboxFilterProps extends SearchkitComponentProps {
  id: string
  filter: any
  title: string
  label: string
  containerComponent?: ReactComponentType<any>
  listComponent?: ReactComponentType<any>
  showCount?: boolean
}

export class CheckboxFilter extends SearchkitComponent<CheckboxFilterProps, any> {
  accessor: CheckboxFilterAccessor

  static propTypes = defaults({
    id: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired,
    label: React.PropTypes.string.isRequired,
    filter: React.PropTypes.object.isRequired,
    translations: SearchkitComponent.translationsPropType(
        CheckboxFilterAccessor.translations
    ),
    showCount: React.PropTypes.bool,
  }, SearchkitComponent.propTypes)

  static defaultProps = {
    listComponent: CheckboxItemList,
    containerComponent: Panel,
    collapsable: false,
    showCount: true
  }

  constructor(props){
    super(props)
    this.toggleFilter = this.toggleFilter.bind(this)
  }

  defineAccessor() {
    const { id, title, translations, label, filter } = this.props;
    return new CheckboxFilterAccessor(id, {
      id, title, label, translations, filter
    })
  }

  toggleFilter(key) {
    this.accessor.state = this.accessor.state.create(!this.accessor.state.getValue())
    this.searchkit.performSearch()
  }

  setFilters(keys) {
    this.accessor.state = this.accessor.state.setValue(keys.length > 0)
    this.searchkit.performSearch()
  }

  getSelectedItems() {
    if (this.accessor.state.getValue()) {
      return [this.props.label]
    } else {
      return []
    }
  }

  render() {
    const { listComponent, containerComponent, showCount, title, id, label } = this.props

    const disabled =  (this.searchkit.getHitsCount() == 0) && !this.accessor.state.getValue()

    return renderComponent(containerComponent, {
      title,
      className: id ? `filter--${id}` : undefined,
      disabled
    },
      renderComponent(listComponent, {
        items: [{ key: label, doc_count: this.accessor.getDocCount() }],
        selectedItems: this.getSelectedItems(),
        toggleItem: this.toggleFilter,
        setItems: this.setFilters.bind(this),
        showCount
      })
    );
  }

}
