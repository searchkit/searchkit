import {State} from "../state"
import {FilterBasedAccessor} from "./FilterBasedAccessor"
import {
  CardinalityMetric, BoolMust, SelectedFilter, FilterBucket
} from "../query";

import {assign} from 'lodash'

export interface CheckboxFilterAccessorOptions {
  id:string
  filter: any
  title?:string
  label?:string
  translations?:Object
  defaultValue?: boolean
}

export class CheckboxFilterAccessor extends FilterBasedAccessor<State<boolean>> {

  state = new State<boolean>(false)
  options:any
  uuid:string
  filter: any

  static translations:any = {
    "checkbox.on":"active"
  }

  constructor(key, options:CheckboxFilterAccessorOptions){
    super(key, options.id)
    this.options = options
    this.filter = options.filter
    this.state = this.state.create(options.defaultValue)
    this.translations = assign({}, options.translations)
  }

  getDocCount(){
    return this.getAggregations([this.uuid, "doc_count"], 0)
  }

  buildSharedQuery(query){
    if(this.state.getValue()){
      query = query.addFilter(this.uuid, this.filter)
        .addSelectedFilter({
          name:this.options.title || this.translate(this.key),
          value: this.options.label || this.translate("checkbox.on"),
          id: this.options.id,
          remove:()=> this.state = this.state.setValue(false)
        })
    }

    return query
  }

  buildOwnQuery(query){
    var filters = query.getFilters()
    if (!this.state.getValue()){
      if (filters) filters = BoolMust([filters, this.filter])
      else filters = this.filter
    }
    return query
      .setAggs(FilterBucket(
        this.uuid,
        filters
      ))
  }
}
