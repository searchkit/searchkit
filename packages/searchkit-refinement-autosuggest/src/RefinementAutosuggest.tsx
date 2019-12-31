import * as React from 'react'
import {
  SearchkitComponent,
  Panel,
  renderComponent,
  FacetAccessorOptions,
  RenderComponentType
} from 'searchkit'
import { RefinementSuggestAccessor } from './RefinementAutosuggestAccessor'

import { ReactSelectAdapter, AdapterProps } from './adapters'

export const RefinementAutosuggestItem = ({ key, doc_count }) => (
  <div className="sk-item-list-option sk-item-list__item">
    <div data-qa="label" className="sk-item-list-option__text">
      {key}
    </div>
    <div data-qa="count" className="sk-item-list-option__count">
      {doc_count}
    </div>
  </div>
)

export interface RefinementAutosuggestProps extends Partial<FacetAccessorOptions> {
  multi: boolean
  autosuggestComponent?: RenderComponentType<AdapterProps>
  containerComponent?: RenderComponentType<any>
  itemComponent?: RenderComponentType<any>
  size?: number
}

export class RefinementAutosuggest extends SearchkitComponent<RefinementAutosuggestProps, any> {
  accessor: RefinementSuggestAccessor
  static defaultProps = {
    containerComponent: Panel,
    autosuggestComponent: ReactSelectAdapter,
    itemComponent: RefinementAutosuggestItem,
    multi: false,
    size: 5
  }

  defineAccessor() {
    const { id, field, title, operator, size, orderKey, orderDirection, fieldOptions } = this.props
    return new RefinementSuggestAccessor(id, {
      id,
      field,
      title,
      operator,
      size,
      orderKey,
      orderDirection,
      fieldOptions
    })
  }

  search = async (query) => {
    const options = await this.accessor.search(query)

    return options
  }

  select = (values) => {
    this.accessor.state = this.accessor.state.setValue(values)
    this.searchkit.performSearch()
  }

  render() {
    const { containerComponent, autosuggestComponent, id, title, multi, itemComponent } = this.props
    const selectedValues = this.accessor.state.getValue()

    return renderComponent(
      containerComponent,
      {
        title,
        className: id ? `filter--${id}` : undefined
      },
      renderComponent(autosuggestComponent, {
        multi,
        loadOptions: this.search,
        onSelect: this.select,
        selectedValues,
        itemComponent
      })
    )
  }
}
