import {FilterBasedAccessor} from "./FilterBasedAccessor";
import {ObjectState} from "../state";

import {
	FilterBucket,
	HistogramBucket,
	RangeQuery,
	BoolMust,
	CardinalityMetric,
	FieldOptions,
	FieldContext,
	FieldContextFactory
} from "../query";

import {maxBy} from "lodash"
import {get} from "lodash"

export interface RangeAccessorOptions {
	title:string
	id:string
	min:number
	max:number
  interval?: number
	field:string,
	loadHistogram?:boolean
	fieldOptions?:FieldOptions
}

export class RangeAccessor extends FilterBasedAccessor<ObjectState> {
	options:any
	state = new ObjectState({})
	fieldContext:FieldContext

	constructor(key, options:RangeAccessorOptions){
    super(key, options.id)
    this.options = options
		this.options.fieldOptions = this.options.fieldOptions || {type:"embedded"}
    this.options.fieldOptions.field = this.options.field
    this.fieldContext = FieldContextFactory(this.options.fieldOptions)
  }

	buildSharedQuery(query) {
		if (this.state.hasValue()) {
			let val:any = this.state.getValue()
			let rangeFilter = this.fieldContext.wrapFilter(RangeQuery(this.options.field,{
        gte:val.min, lte:val.max
      }))
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
    return this.getAggregations([
			this.key,
			this.fieldContext.getAggregationPath(),
			this.key, "buckets"], [])
  }

	isDisabled() {
		if (this.options.loadHistogram) {
			const maxValue = get(maxBy(this.getBuckets(), "doc_count"), "doc_count", 0)
			return maxValue === 0
		} else {
			return this.getAggregations([
				this.key,
				this.fieldContext.getAggregationPath(),
				this.key, "value"], 0) === 0
		}
	}

  getInterval(){
    if (this.options.interval) {
      return this.options.interval
    }
    return Math.ceil((this.options.max - this.options.min) / 20)
  }

  buildOwnQuery(query) {
			let otherFilters = query.getFiltersWithoutKeys(this.key)
			let filters = BoolMust([
				otherFilters,
				this.fieldContext.wrapFilter(					
					RangeQuery(this.options.field,{
						gte:this.options.min, lte:this.options.max
					})
				)
			])

			let metric

			if (this.options.loadHistogram) {
				metric = HistogramBucket(this.key, this.options.field, {
					"interval":this.getInterval(),
					"min_doc_count":0,
					"extended_bounds":{
						"min":this.options.min,
						"max":this.options.max
					}
				})
			} else {
				metric = CardinalityMetric(this.key, this.options.field)
			}

			return query.setAggs(FilterBucket(
				this.key,
				filters,
				...this.fieldContext.wrapAggregations(metric)
			))
	}
}
