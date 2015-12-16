import {State, LevelState} from "../state"
import {Accessor} from "./Accessor"
import {Term, Terms, BoolShould, BoolMust} from "../query/QueryBuilders";
import * as _ from "lodash";


export class HierarchicalFacetAccessor extends Accessor<LevelState> {

  state = new LevelState()
  options:any
  constructor(key, options:any){
    super(key)
    this.options = options
  }

  getBuckets(level){
    const results = this.getResults()
    var field = this.options.fields[level]
    const path = ['aggregations',field, field,'buckets']
    return _.get(results, path, [])
  }

  buildSharedQuery(query) {

    _.each(this.options.fields, (field:string, i:number) => {
      var filters = this.state.getLevel(i);
      var parentFilter = this.state.getLevel(i-1);

      var filterTerms = _.map(filters, (filter:any, idx)=> {
        return Term(field, filter, {
          $name:this.translate(parentFilter[0]) || this.options.title || this.translate(field),
          $value:this.translate(filter),
          $id:this.options.id,
          $remove:()=> {
            this.state = this.state.remove(i, filter)
          },
          $disabled: this.state.levelHasFilters(i+1)
        })
      });

      if(filterTerms.length > 0){
        query = query.addFilter(field, BoolShould(filterTerms))
      }
    })

    return query
  }

  buildOwnQuery(query){
    var filters = this.state.getValue()
    var field = this.options.fields[0]
    var aggs = {};

    _.each(this.options.fields, (field:string, i:number) => {

      if (this.state.levelHasFilters(i-1) || i == 0) {
        aggs[field] = {
          filter:query.getFilters(_.slice(this.options.fields,i)),
          aggs:{
            [field]:Terms(field, {size:20})
          }
        }

      }

    });

    query = query.setAggs(aggs)

    return query
  }

}
