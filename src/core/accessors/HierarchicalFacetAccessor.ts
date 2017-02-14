import {State, LevelState} from "../state"
import {FilterBasedAccessor} from "./FilterBasedAccessor";
import {
  TermQuery, TermsBucket, FilterBucket,
  BoolShould, BoolMust
} from "../query/";
import {map} from "lodash"
import {each} from "lodash"
import {compact} from "lodash"
import {take} from "lodash"
import {omitBy} from "lodash"
import {isUndefined} from "lodash"

export interface HierarchicalFacetAccessorOptions{
  fields:Array<string>
  size:number
  id:string
  title:string
  orderKey?:string
  orderDirection?:string
}

export class HierarchicalFacetAccessor extends FilterBasedAccessor<LevelState> {

  state = new LevelState()
  options:any
  uuids:Array<String>

  constructor(key, options:HierarchicalFacetAccessorOptions){
    super(key)
    this.options = options
    this.computeUuids()
  }

  computeUuids(){
    this.uuids = map(
      this.options.fields, field => this.uuid + field)
  }

  onResetFilters(){
    this.resetState()
  }

  getBuckets(level){
    var field = this.options.fields[level]
    return this.getAggregations([this.options.id, field, field, "buckets"], [])
  }


  getOrder(){
    if(this.options.orderKey){
      let orderDirection = this.options.orderDirection || "asc"
      return {[this.options.orderKey]:orderDirection}
    }
  }

  buildSharedQuery(query) {

    each(this.options.fields, (field:string, i:number) => {
      var filters = this.state.getLevel(i);
      var parentFilter = this.state.getLevel(i-1);
      var isLeaf = !this.state.levelHasFilters(i+1)
      var filterTerms = map(filters, TermQuery.bind(null, field))

      if(filterTerms.length > 0){
        query = query.addFilter(
          this.uuids[i],
          (filterTerms.length  > 1 ) ?
          BoolShould(filterTerms) : filterTerms[0])
        }

      if(isLeaf){
        var selectedFilters = map(filters, (filter)=> {
          return {
            id:this.options.id,
            name:this.translate(parentFilter[0]) || this.options.title || this.translate(field),
            value:this.translate(filter),
            remove:()=> {
              this.state = this.state.remove(i, filter)
            }
          }
        })
        query = query.addSelectedFilters(selectedFilters)
      }

    })

    return query
  }

  buildOwnQuery(query){
    var filters = this.state.getValue()
    var field = this.options.fields[0]
    let lvlAggs = compact(map(this.options.fields, (field:string, i:number) => {
      if (this.state.levelHasFilters(i-1) || i == 0) {
        return FilterBucket(
          field,
          query.getFiltersWithKeys(take(this.uuids,i)),
          TermsBucket(field, field, omitBy({
            size:this.options.size, order:this.getOrder()
          }, isUndefined))
        )
      }
    }));

    var aggs = FilterBucket(
      this.options.id,
      query.getFiltersWithoutKeys(this.uuids),
      ...lvlAggs
    )

    return query.setAggs(aggs)
  }

}
