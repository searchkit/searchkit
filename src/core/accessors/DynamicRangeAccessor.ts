import {FilterBasedAccessor} from "./FilterBasedAccessor";
import {ObjectState} from "../state";

import {
	FilterBucket,
	RangeQuery,
	BoolMust,
	StatsMetric
} from "../query";

const maxBy = require("lodash/maxBy")
const get = require("lodash/get")

export interface DynamicRangeAccessorOptions {
	title:string
	id:string
	field:string
}

export class DynamicRangeAccessor extends FilterBasedAccessor<ObjectState> {
	options:any
	state = new ObjectState({})

	constructor(key, options:DynamicRangeAccessorOptions){
    super(key, options.id)
    this.options = options
  }

	buildSharedQuery(query) {
		if (this.state.hasValue()) {
			let val:any = this.state.getValue()
			let rangeFilter = RangeQuery(this.options.field,{
        gte:val.min, lte:val.max
      })
			let selectedFilter = {
				name:this.translate(this.options.title),
				value:`${val.min} - ${val.max}`,
				id:this.options.id,
				remove:()=> {
					this.state = this.state.clear()
				}
			}

			return query
				.addFilter(this.key, rangeFilter)
				.addSelectedFilter(selectedFilter)

		}

		return query
	}

  getStat(stat) {
    return this.getAggregations(
      [this.key, this.key, stat], 0
    )
  }

	isDisabled() {
		return (this.getStat("count") === 0) || (this.getStat("min") === this.getStat("max"))
	}

  buildOwnQuery(query) {
			let otherFilters = query.getFiltersWithoutKeys(this.key)

			return query.setAggs(FilterBucket(
				this.key,
				otherFilters,
				StatsMetric(this.key, this.options.field)
			))
	}
}
