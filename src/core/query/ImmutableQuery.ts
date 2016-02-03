const update = require("react-addons-update")
import {BoolMust} from "./query_dsl"
import {Utils} from "../support/Utils"
import {SelectedFilter} from "./SelectedFilter"
const omitBy = require("lodash/omitBy")
const omit = require("lodash/omit")
const values = require("lodash/values")
const pick = require("lodash/pick")
const merge = require("lodash/merge")
const isUndefined = require("lodash/isUndefined")

export class ImmutableQuery {
  index: any
  query: any
  static defaultIndex:any = {
    queryString:"",
    filtersMap:{},
    selectedFilters:[],
    queries:[],
    filters:[],
    size:0
  }
  constructor(index = ImmutableQuery.defaultIndex) {
    this.index = index
    this.buildQuery()
  }

  buildQuery(){
    let query:any = {}
    if(this.index.queries.length > 0) {
      query.query = BoolMust(this.index.queries)
    }
    if(this.index.filters.length > 0) {
      query.filter = BoolMust(this.index.filters)
    }
    query.aggs = this.index.aggs
    query.size = this.index.size
    query.from = this.index.from
    query.sort = this.index.sort
    query.highlight = this.index.highlight
    query.suggest = this.index.suggest
    this.query = omitBy(query, isUndefined)
  }

  hasFilters(){
    return this.index.filters.length > 0
  }

  hasFiltersOrQuery(){
    return (this.index.queries.length +
      this.index.filters.length) > 0 || !!this.index.sort
  }

  addQuery(query:any) {
    if(!query){
      return this
    }
    return this.update({
      queries:{ $push: [query] }
    })
  }

  setQueryString(queryString){
    return this.update({ $merge: { queryString} })
  }

  getQueryString(){
    return this.index.queryString
  }

  addSelectedFilter(selectedFilter:SelectedFilter){
    return this.addSelectedFilters([selectedFilter])
  }
  addSelectedFilters(selectedFilters:Array<SelectedFilter>){
    return this.update({
      selectedFilters:{$push:selectedFilters}
    })
  }

  getSelectedFilters(){
    return this.index.selectedFilters
  }
  addAnonymousFilter(bool){
    return this.addFilter(Utils.guid(), bool)
  }

  addFilter(key, filter) {
    return this.update({
      filters: { $push: [filter] },
      filtersMap:{ $merge:{ [key]:filter } }
    })
  }

  setAggs(aggs) {
    return this.deepUpdate("aggs", aggs)
  }

  getFilters(keys) {
    return this.getFiltersWithoutKeys(keys)
  }

  _getFilters(keys, method){
    keys = [].concat(keys)
    const filters = values(method(this.index.filtersMap || {}, keys))
    return BoolMust(filters)
  }
  getFiltersWithKeys(keys){
    return this._getFilters(keys, pick)
  }
  getFiltersWithoutKeys(keys){
    return this._getFilters(keys, omit)
  }

  setSize(size: number) {
    return this.update({ $merge: { size } })
  }

  setSort(sort: any) {
    return this.update({ $merge: {sort:sort}})
  }

  setHighlight(highlight: any) {
    return this.deepUpdate("highlight", highlight)
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

  deepUpdate(key, ob){
    return this.update({
      $merge: {
        [key]:merge({}, this.index[key] || {}, ob)
      }
    })
  }

  setSuggestions(suggestions) {
    return this.update({
      $merge:{suggest:suggestions}
    })
  }

  update(updateDef) {
    return new ImmutableQuery(
      update(this.index, updateDef)
    )
  }

  getJSON() {
    return this.query
  }

  printJSON(){
    console.log(JSON.stringify(this.getJSON(), null, 2))
  }
}
