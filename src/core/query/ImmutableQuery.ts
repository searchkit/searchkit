const update = require("react-addons-update")
import {BoolMust} from "./QueryBuilders"
import * as _ from "lodash"
import {Utils} from "../support/Utils"

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
    filtersArray:[]
  }
  constructor(query = ImmutableQuery.defaultQuery, index = ImmutableQuery.defaultIndex) {
    this.index = index
    this.query = query
  }

  hasFilters(){
    return !_.isEmpty(this.index.filters)
  }

  hasFiltersOrQuery(){
    return (this.query.query.$array.length +
      this.query.filter.$array.length) > 0
  }

  addQuery(query) {
    if (query) {
      return this.update({
        query: BoolMust({ $push: [query] })
      })
    }
    return this
  }

  addHiddenFilter(bool){
    return this.addFilter(Utils.guid(), bool)
  }

  addFilter(key, bool) {
    var newIndex = update(this.index,{
      filters:{
        $merge:{[key]:bool}
      },
      filtersArray:{
        $push:bool.$array
      }
    })

    return this.update({
      filter: BoolMust({ $push: [bool] })
    }, newIndex)

  }

  getFiltersArray(){
    return this.index.filtersArray || []
  }

  setAggs(aggs) {
    return this.update({ $merge: { aggs } })
  }

  getFilters(key = undefined) {
    if (!_.isArray(key)) {
      key = [key];
    }
    const filters = _.values(_.omit(this.index.filters || {}, key))
    return BoolMust(filters)
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

  static areQueriesDifferent(queryA: ImmutableQuery, queryB: ImmutableQuery) {
    if (!queryA || !queryB) {
      return true
    }

    return !_.isEqual(queryA.getJSON(), queryB.getJSON())
  }

  getJSON() {
    const replacer = (key, value) => {
      if (/^\$/.test(key)) {
        return undefined
      } else {
        return value
      }
    }
    return JSON.parse(JSON.stringify(this.query, replacer))
  }
}
