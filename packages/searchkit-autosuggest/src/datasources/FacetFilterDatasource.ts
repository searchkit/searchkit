import { FacetAccessor, SearchkitManager, FacetAccessorOptions } from 'searchkit'
import { createRegexQuery } from '../Utils'
import { SearchkitDatasource } from './Types'

export type FacetFilterDatasourceOptions = {
  accessorId?: string
  onSelect?: Function
  itemRenderer?: Function
} & FacetAccessorOptions

export class FacetFilterDatasource implements SearchkitDatasource {
  options: FacetFilterDatasourceOptions
  searchkit: SearchkitManager
  originalAccessor: FacetAccessor
  delegateAccessor: FacetAccessor

  constructor(options) {
    this.options = options
  }

  isSearchkitSource() {
    return true
  }

  configure(searchkit) {
    this.searchkit = searchkit
    if (this.options.accessorId) {
      const accessor = searchkit.accessors.statefulAccessors[this.options.accessorId]
      if (!accessor) {
        console.error(
          `Could not create facet filter datasource with accessorId=${this.options.accessorId}`
        )
      } else {
        this.originalAccessor = accessor
      }
    } else {
      const { id, field, operator, fieldOptions, title, size } = this.options
      this.originalAccessor = new FacetAccessor(id, {
        id,
        field,
        operator,
        fieldOptions,
        title,
        size
      })
      this.searchkit.addAccessor(this.originalAccessor)
    }
    this.delegateAccessor = this.createDelegate(this.originalAccessor)
  }

  createDelegate(accessor) {
    const delegateAccessor = new FacetAccessor(accessor.options.id, { ...accessor.options })
    delegateAccessor.uuid = accessor.options.id
    return delegateAccessor
  }

  search(query, queryString) {
    this.delegateAccessor.options.include = createRegexQuery(queryString)
    this.delegateAccessor.size = this.options.size || 3
    return this.delegateAccessor.buildOwnQuery(query)
  }

  onSelect = (item) => {
    const state = this.originalAccessor.state.toggle(item.key)
    if (this.options.onSelect) {
      this.options.onSelect(item, state.getValue())
    } else {
      this.originalAccessor.state = state
      this.searchkit.performSearch()
    }
    return ''
  }

  getGroupedResult(results) {
    this.delegateAccessor.setResults(results)
    this.delegateAccessor.getBuckets().forEach((item) => {
      item.select = () => this.onSelect(item)
    })
    return {
      id: this.delegateAccessor.options.id,
      title: this.delegateAccessor.options.title,
      results: this.delegateAccessor.getBuckets(),
      onSelect: this.onSelect
    }
  }
}
