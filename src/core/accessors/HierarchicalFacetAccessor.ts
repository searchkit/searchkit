import {ObjectState, ArrayState} from "../state/State"
import {Accessor} from "./Accessor"
import {Term, Terms, BoolShould, BoolMust} from "../query/QueryBuilders";
import * as _ from "lodash";

export class HierarchicalState extends ObjectState {
  value:Object
  defaultValue:Object

  lazyInit() {
    this.value = this.value || {}
    return this.value
  }

  add(level:number, val) {
    var value = this.lazyInit()
    if (!_.isArray(value[level])) value[level] = [];
    value[level].push(val);
  }

  contains(level:number, val) {
    return _.contains(this.lazyInit()[level], val)
  }

  clear(level?:number):void {
    if (level) {
      let val = this.lazyInit()[level]
      val = []
    } else {
      this.value = []
    }
  }

  remove(level:number, val) {
    this.value = _.without(this.lazyInit()[level], val)
  }

  toggle(level:number, val) {
    if(this.contains(level, val)) {
      this.add(level, val);
    } else {
      this.remove(level, val);
    }
  }

  getLevel(level:number):Array<string> {
    return this.lazyInit()[level] || [];
  }

  levelHasFilters(level:number):boolean {
    return this.getLevel(level).length > 0;
  }

}

export class HierarchicalFacetAccessor extends Accessor<HierarchicalState> {

  state = new HierarchicalState()
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
    console.log(this.state.getValue())
    var filters = this.state.getLevel(0)
    var filterTerms = _.map(filters, (filter:any)=> {
      return Term(this.options.fields[0], filter, {
        $name:this.options.title || this.options.fields[0],
        $value:filter,
        $remove:()=> {
          this.state.remove(0, filter)
        }
      })
    } );
    var boolBuilder = BoolShould;
    if(filterTerms.length > 0){
      query = query.addFilter(this.options.fields[0], boolBuilder(filterTerms))
    }
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
