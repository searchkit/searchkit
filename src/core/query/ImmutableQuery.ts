const update = require("react-addons-update")
import {BoolMust} from "./query_dsl"
import * as _ from "lodash"
import {Utils} from "../support/Utils"
import {SelectedFilter} from "./SelectedFilter"

export class ImmutableQuery {
  index: any
  query: any
  static defaultQuery: any = {
	  filter: BoolMust([]),
    query: BoolMust([]),
    size:0
  }
  static defaultIndex:any = {
    filters:{},
    selectedFilters:[]
  }
  constructor(query = ImmutableQuery.defaultQuery, index = ImmutableQuery.defaultIndex) {
    this.query = query
    this.index = index
  }

  hasFilters(){
    return !_.isEmpty(this.index.filters)
  }

  hasFiltersOrQuery(){
    return (this.query.query.bool.must.length +
      this.query.filter.bool.must.length) > 0 || !!this.query.sort
  }

  addQuery(query:any) {
    if (query) {
      return this.update({
        query: BoolMust({ $push: [query] })
      })
    }
    return this
  }

  addSelectedFilter(selectedFilter:SelectedFilter){
    return this.addSelectedFilters([selectedFilter])
  }
  addSelectedFilters(selectedFilters:Array<SelectedFilter>){
    return new ImmutableQuery(this.query, update(this.index, {
      selectedFilters:{$push:selectedFilters}
    }))
  }

  getSelectedFilters(){
    return this.index.selectedFilters
  }
  addAnonymousFilter(bool){
    return this.addFilter(Utils.guid(), bool)
  }

  addFilter(key, bool) {
    var newIndex = update(this.index,{
      filters:{
        $merge:{[key]:bool}
      }
    })
    return this.update({
      filter: BoolMust({ $push: [bool] })
    }, newIndex)

  }

  setAggs(aggs) {
    let existingAggs = this.query.aggs || {}
    let newAggs = _.extend({}, existingAggs, aggs)
    return this.update({ $merge:{aggs:newAggs} })
  }

  getFilters(keys) {
    return this.getFiltersWithoutKeys(keys)
  }

  _getFilters(keys, method){
    keys = [].concat(keys)
    const filters = _.values(method(this.index.filters || {}, keys))
    return BoolMust(filters)
  }
  getFiltersWithKeys(keys){
    return this._getFilters(keys, _.pick)
  }
  getFiltersWithoutKeys(keys){
    return this._getFilters(keys, _.omit)
  }

  setSize(size: number) {
    return this.update({ $merge: { size } })
  }

  setSort(sort: string) {
    return this.update({ $merge: {sort:sort}})
  }

  getSize(){
    return this.query.size
  }

  setFrom(from: number) {
    return this.update({ $merge: { from } })
  }

  getFrom(){
    return this.query.from
  }

  update(updateDef, newIndex = this.index) {
    return new ImmutableQuery(
      update(this.query, updateDef),
      newIndex
    )
  }

  getJSON() {
    return this.query
  }
}
