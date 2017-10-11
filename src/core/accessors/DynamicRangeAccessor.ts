import {FilterBasedAccessor} from "./FilterBasedAccessor";
import {ObjectState} from "../state";

import {
	FilterBucket,
	RangeQuery,
	StatsMetric,
	FieldOptions,
	FieldContext,
	FieldContextFactory
} from "../query";

const assign = require("lodash/assign")
const identity = require("lodash/identity")

export interface DynamicRangeAccessorOptions {
	title:string
	id:string
	field:string
	fieldOptions?:FieldOptions
	rangeFormatter?: Function
	translations?: Object
}

export class DynamicRangeAccessor extends FilterBasedAccessor<ObjectState> {
	options:any
	fieldContext:FieldContext
	state = new ObjectState({})
	
	static translations: any = {
		"range.divider": " - "
	}
	translations = DynamicRangeAccessor.translations
	
	constructor(key, options:DynamicRangeAccessorOptions){
    super(key, options.id)
    this.options = options
		this.options.fieldOptions = this.options.fieldOptions || {type:"embedded"}
    this.options.fieldOptions.field = this.options.field
		this.fieldContext = FieldContextFactory(this.options.fieldOptions)
		this.options.rangeFormatter = this.options.rangeFormatter || identity
		if (options.translations) {
			this.translations = assign({}, this.translations, options.translations)
		}
	}
	
	getSelectedValue(value) {
		let divider = this.translate("range.divider")
		return [
			this.options.rangeFormatter(value.min),
			divider,
			this.options.rangeFormatter(value.max),
		].join("")
	}

	buildSharedQuery(query) {
		if (this.state.hasValue()) {
			let val:any = this.state.getValue()
			let rangeFilter = this.fieldContext.wrapFilter(RangeQuery(this.options.field,{
        gte:val.min, lte:val.max
      }))
			let selectedFilter = {
				name:this.translate(this.options.title),
				value:this.getSelectedValue(val),
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
    return this.getAggregations([
			this.key,
			this.fieldContext.getAggregationPath(),
			this.key, stat],0 )
  }

	isDisabled() {
		return (this.getStat("count") === 0) || (this.getStat("min") === this.getStat("max"))
	}

  buildOwnQuery(query) {
			let otherFilters = query.getFiltersWithoutKeys(this.key)

			return query.setAggs(FilterBucket(
				this.key,
				otherFilters,
				...this.fieldContext.wrapAggregations(					
					StatsMetric(this.key, this.options.field)
				)
			))
	}
}
