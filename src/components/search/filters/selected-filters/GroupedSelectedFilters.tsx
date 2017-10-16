import * as React from "react";

import {
  SearchkitComponent,
  SearchkitComponentProps,
  RenderComponentType,
  renderComponent,
  SelectedFilter
} from "../../../../core"

import {
	FilterGroup
} from "../../../ui"


const defaults = require("lodash/defaults")
const groupBy = require("lodash/groupBy")
const size = require("lodash/size")
const toArray = require("lodash/toArray")
const forEach = require("lodash/forEach")
const map = require("lodash/map")


export interface GroupedSelectedFiltersProps extends SearchkitComponentProps {
  groupComponent?: RenderComponentType<any>
}

export class GroupedSelectedFilters extends SearchkitComponent<GroupedSelectedFiltersProps, any> {
  bemBlocks: {
    container: Function
  }

  static propTypes = defaults({
  }, SearchkitComponent.propTypes)

  static defaultProps = {
    groupComponent: FilterGroup
  }

  constructor(props) {
    super(props)
    this.translate = this.translate.bind(this)
    this.removeFilter = this.removeFilter.bind(this)
    this.removeFilters = this.removeFilters.bind(this)
  }

  defineBEMBlocks() {
    const blockName = (this.props.mod || "sk-filter-groups")
    return {
      container: blockName
    }
  }

  getFilters() {
    return this.getQuery().getSelectedFilters()
  }

  getGroupedFilters(): Array<any> {
    const filters = this.getFilters();
    return toArray(groupBy(filters, 'id'))
  }

  hasFilters(): boolean {
    return size(this.getFilters()) > 0;
  }

  removeFilter(filter) {
    filter.remove()
    this.searchkit.performSearch()
  }

  removeFilters(filters:Array<SelectedFilter>) {
    forEach(filters, filter => filter.remove())
    this.searchkit.performSearch()
  }

  render() {
    const { groupComponent } = this.props

    if (!this.hasFilters()) {
        return null
    }

    return (
      <div className={this.bemBlocks.container() }>
        {map(this.getGroupedFilters(), (filters) =>
          renderComponent(groupComponent, {
            key:filters[0].id,
            className: filters[0].id ? `filter-group-${filters[0].id}` : undefined,
            title: this.translate(filters[0].name),
            filters: filters,
            translate: this.translate,
            removeFilter: this.removeFilter,
            removeFilters: this.removeFilters
          })
        )}
      </div>
    )
  }
}
