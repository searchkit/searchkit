import { ImmutableQuery, FacetAccessor } from 'searchkit'
import get from 'lodash/get'
import { createRegexQuery } from './Utils'

export class RefinementSuggestAccessor extends FacetAccessor {
  buildOwnQuery(query) {
    return query
  }

  async search(query) {
    const sharedQuery = this.searchkit.accessors.buildSharedQuery(new ImmutableQuery())
    this.options.include = createRegexQuery(query)
    const searchQuery = super.buildOwnQuery(sharedQuery).setSize(0)

    const results = await this.searchkit.transport.search(searchQuery.getJSON())

    return get(results, ['aggregations', this.uuid, this.options.field, 'buckets'], [])
  }
}
