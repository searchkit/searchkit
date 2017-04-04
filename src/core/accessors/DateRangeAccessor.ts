import * as moment from "moment";

import { get, identity } from "lodash"
import {
  ObjectState,
  FilterBucket,
  BoolMust,
  FieldOptions,
  FieldContext,
  FieldContextFactory,
} from "../../core";

import {
  FilterBasedAccessor,
} from ".";

import { DateRangeQuery } from "../query";

export interface DateRangeAccessorOptions {
  title:string
  id:string
  fromDate:moment.Moment
  toDate:moment.Moment
  interval?: number
  fromDateField:string
  toDateField:string
  loadHistogram?:boolean
  fieldOptions?:FieldOptions
  rangeFormatter?:(count:number)=> number | string
  onClearState?:(newValue?:any) => any
}

export class DateRangeAccessor extends FilterBasedAccessor<ObjectState> {
  options:DateRangeAccessorOptions
  state = new ObjectState({})
  fieldContext:FieldContext
  rangeFormatter:(count:number)=> number | string

  constructor(key, options:DateRangeAccessorOptions){
    super(key, options.id)
    this.options = options
    this.options.fieldOptions = this.options.fieldOptions || { type:"embedded" }
    this.fieldContext = FieldContextFactory(this.options.fieldOptions)
    this.rangeFormatter = this.options.rangeFormatter || identity

    const { fromDate, toDate } = options
    if (fromDate || toDate) {
      this.state = this.state.setValue({
        fromDate,
        toDate
      })
    }
  }

  clearState = () => {
    // Need to pass state reset through parent component so view can be updated
    this.options.onClearState()
  }

  fromQueryObject(ob){
    let fromValue = ob[this.urlKey + '_from']
    let toValue = ob[this.urlKey + '_to']

    if (fromValue || toValue) {
      this.state = this.state.setValue({
        fromDate: fromValue && moment(+fromValue),
        toDate: toValue && moment(+toValue)
      })
    }
  }

  getQueryObject(){
    let val:any = this.state.getValue()
    let fromDate = val.fromDate && +val.fromDate
    let toDate = val.toDate && +val.toDate
    return (val) ? {
      [this.urlKey + '_from']:fromDate,
      [this.urlKey + '_to']:toDate
    } : {}
  }

  buildSharedQuery(query) {
    if (this.state.hasValue()) {
      let val:any = this.state.getValue()
      let fromDateRangeFilter = this.fieldContext.wrapFilter(DateRangeQuery(this.options.fromDateField,{
        lte: +val.toDate
      }))
      let toDateRangeFilter = this.fieldContext.wrapFilter(DateRangeQuery(this.options.toDateField,{
        gte: +val.fromDate
      }))
      const fromVal = this.rangeFormatter(val.fromDate);
      const toVal = this.rangeFormatter(val.toDate);
      const selectedFilterText = (val.toDate)
        ? `${fromVal} – ${toVal}`
        : `${fromVal} –`
      let selectedFilter = {
        name: this.translate(this.options.title),
        value: selectedFilterText,
        id: this.options.id,
        remove: this.clearState
      }

      return query
        .addFilter(this.key+'_to', fromDateRangeFilter)
        .addFilter(this.key+'_from', toDateRangeFilter)
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
    // This accessor is never "disabled"; the calendar should always be visible
    return false
  }

  buildOwnQuery(query) {
    if (this.state.hasValue()) {
      let val:any = this.state.getValue()
      let otherFilters = query.getFiltersWithoutKeys(this.key)
      let filters = BoolMust([
        otherFilters,
        this.fieldContext.wrapFilter(
          DateRangeQuery(this.options.fromDateField, {
            lte: +val.toDate
          })
        ),
        this.fieldContext.wrapFilter(
          DateRangeQuery(this.options.toDateField, {
            gte: +val.fromDate
          })
        )
      ])

      query = query.setAggs(
        FilterBucket(
          this.key,
          filters
        )
      )
    }

    return query
  }
}
