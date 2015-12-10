import {ArrayState} from "../state/State"
import {Accessor} from "./Accessor"
import {Term, Terms, BoolShould, BoolMust} from "../query/QueryBuilders";
import * as _ from "lodash";


export interface FacetAccessorOptions {
  operator?:string,
  title?:string
  id?:string
}

export class FacetAccessor extends Accessor<ArrayState> {


  state = new ArrayState()
  options:any
  constructor(key, options:FacetAccessorOptions){
    super(key, options.id)
    this.options = options
  }

  getBuckets(){
    const results = this.getResults()
    const path = ['aggregations',this.key, this.key,'buckets']
    return _.get(results, path, [])
  }

  isOrOperator(){
    return this.options.operator === "OR"
  }

  getBoolBuilder(){
    return this.isOrOperator() ? BoolShould : BoolMust
  }

  buildSharedQuery(query){
    var filters = this.state.getValue()
    var filterTerms = _.map(filters, (filter)=> {
      return Term(this.key, filter, {
        $name:this.options.title || this.key,
        $value:filter,
        $id:this.options.id,
        $remove:()=> {
          this.state = this.state.remove(filter)
        }
      })
    } );
    var boolBuilder = this.getBoolBuilder()
    if(filterTerms.length > 0){
      query = query.addFilter(this.key, boolBuilder(filterTerms))
    }
    return query
  }

  buildOwnQuery(query){
    var filters = this.state.getValue()
    let excludedKey = (this.isOrOperator()) ? this.key : undefined
    query = query.setAggs({
      [this.key]:{
        filter:query.getFilters(excludedKey),
        aggs:{
          [this.key]:Terms(this.key, {size:20})
        }
      }
    })
    return query
  }
}
