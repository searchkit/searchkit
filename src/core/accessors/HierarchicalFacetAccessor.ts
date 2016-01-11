import {State, LevelState} from "../state"
import {Accessor} from "./Accessor"
import {
  TermQuery, TermsBucket, FilterBucket,
  BoolShould, BoolMust
} from "../query/";
import * as _ from "lodash";


export class HierarchicalFacetAccessor extends Accessor<LevelState> {

  state = new LevelState()
  options:any
  uuids:Array<String>

  constructor(key, options:any){
    super(key)
    this.options = options
    this.computeUuids()
  }

  computeUuids(){
    this.uuids = _.map(
      this.options.fields, field => this.uuid + field)
  }

  getBuckets(level){
    var field = this.options.fields[level]
    return this.getAggregations([this.options.id, field, field, "buckets"], [])
  }

  buildSharedQuery(query) {

    _.each(this.options.fields, (field:string, i:number) => {
      var filters = this.state.getLevel(i);
      var parentFilter = this.state.getLevel(i-1);
      var isLeaf = !this.state.levelHasFilters(i+1)
      var filterTerms = _.map(filters, TermQuery.bind(null, field))

      if(filterTerms.length > 0){
        query = query.addFilter(
          this.uuids[i],
          (filterTerms.length  > 1 ) ?
          BoolShould(filterTerms) : filterTerms[0])
        }

      if(isLeaf){
        var selectedFilters = _.map(filters, (filter)=> {
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
    let lvlAggs = _.compact(_.map(this.options.fields, (field:string, i:number) => {
      if (this.state.levelHasFilters(i-1) || i == 0) {
        return FilterBucket(
          field,
          query.getFiltersWithKeys(_.take(this.uuids,i)),
          TermsBucket(field, field, {size:this.options.size})
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
