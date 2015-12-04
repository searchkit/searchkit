import {ArrayState} from "../state/State"
import {Accessor} from "./Accessor"
import {Term, Terms, BoolShould, BoolMust} from "../query/QueryBuilders";
import * as _ from "lodash";


export class FacetAccessor extends Accessor<ArrayState> {
  state = new ArrayState()
  options:any
  constructor(key, options){
    super(key)
    this.options = options
  }

  getBuckets(){
    const results = this.getResults()
    const path = ['aggregations',this.key, this.key,'buckets']
    return _.get(results, path, [])
  }

  isOrOperator(){
    return this.options["operator"] === "OR"
  }

  getBoolBuilder(){
    return this.isOrOperator() ? BoolShould : BoolMust
  }

  buildSharedQuery(query){
    var filters = this.state.getValue()
    var filterTerms = _.map(filters, Term.bind(Term, this.key))
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
