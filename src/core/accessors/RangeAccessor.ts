import {FilterBasedAccessor} from "./FilterBasedAccessor";
import {ObjectState} from "../state";

import {
	FilterBucket,
	HistogramBucket,
	RangeQuery,
	BoolMust
} from "../query";


export interface RangeAccessorOptions {
	title:string
	id:string
	min:number
	max:number
	field:string
}

export class RangeAccessor extends FilterBasedAccessor<ObjectState> {
	options:any
	state = new ObjectState()

	constructor(key, options:RangeAccessorOptions){
    super(key, options.id)
    this.options = options
  }

	buildSharedQuery(query) {
		let val:any = this.state.getValue()

		if (val.min && val.max) {
			let rangeFilter = RangeQuery(this.options.field, val.min, val.max)
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

	getBuckets(){
    return this.getAggregations(
      [this.key, this.key, "buckets"], []
    )
  }

  buildOwnQuery(query) {
		query = query.setAggs(FilterBucket(
			this.key,
			query.getFiltersWithoutKeys(this.key),
			HistogramBucket(this.key, this.options.field, {
				"interval":Math.ceil((this.options.max - this.options.min) / 20),
				"min_doc_count":0,
				"extended_bounds":{
						"min":this.options.min,
						"max":this.options.max
				}
			})
		))
    return query;
  }
}
