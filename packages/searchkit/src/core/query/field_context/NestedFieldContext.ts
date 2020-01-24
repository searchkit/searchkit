import { NestedBucket, NestedQuery } from '../query_dsl'
import { FieldContext } from './FieldContext'
const get = require('lodash/get')

export class NestedFieldContext extends FieldContext {
  constructor(fieldOptions) {
    super(fieldOptions)
    if (!get(this.fieldOptions, 'options.path')) {
      throw new Error('fieldOptions type:nested requires options.path')
    }
  }

  getAggregationPath() {
    return 'inner'
  }

  wrapAggregations(...aggregations) {
    return [NestedBucket('inner', this.fieldOptions.options.path, ...aggregations)]
  }
  wrapFilter(filter) {
    return NestedQuery(this.fieldOptions.options.path, filter, this.fieldOptions.options)
  }
}
