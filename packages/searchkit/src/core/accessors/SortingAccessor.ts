import { ValueState } from '../state'
import { Utils } from '../support'
import { StatefulAccessor } from './StatefulAccessor'
const find = require('lodash/find')
const head = require('lodash/head')
const map = require('lodash/map')

export interface SortingField {
  field: string
  options: Record<string, any>
}

export interface SortingOption {
  label: string
  field?: string
  order?: string
  defaultOption?: boolean
  key?: string
  fields?: Array<SortingField>
}

export interface SortingOptions {
  options: Array<SortingOption>
}

export class SortingAccessor extends StatefulAccessor<ValueState> {
  state = new ValueState()
  options: SortingOptions

  constructor(key, options: SortingOptions) {
    super(key)
    this.options = options
    this.options.options = Utils.computeOptionKeys(this.options.options, ['field', 'order'], 'none')
  }

  getSelectedOption() {
    const options = this.options.options
    return (
      find(options, { key: `${this.state.getValue()}` }) ||
      find(options, { defaultOption: true }) ||
      head(options)
    )
  }

  getSortQuery(sortOption) {
    if (sortOption.fields) {
      return map(sortOption.fields, (field: SortingField) => ({
        [field.field]: field.options || {}
      }))
    } else if (sortOption.field && sortOption.order) {
      return [{ [sortOption.field]: sortOption.order }]
    } else if (sortOption.field) {
      return [sortOption.field]
    }
    return null
  }

  buildOwnQuery(query) {
    const selectedSortOption = this.getSelectedOption()
    if (selectedSortOption) {
      const sortQuery = this.getSortQuery(selectedSortOption)
      if (sortQuery) {
        query = query.setSort(sortQuery)
      }
    }
    return query
  }
}
