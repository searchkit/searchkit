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
    if (!level) {
      this.value = [];
      return;
    }
    if (level && this.value && this.value[level]) {
      this.value[level] = []
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

    _.each(this.options.fields, (field:string, i:number) => {
      var filters = this.state.getLevel(i)
      var filterTerms = _.map(filters, (filter:any)=> {
        return Term(field, filter, {
          $name:this.options.title || field,
          $value:filter,
          $remove:this.state.remove.bind(this.state, i, filter)

        })
      } );
      var boolBuilder = BoolShould;
      if(filterTerms.length > 0){
        query = query.addFilter(field, boolBuilder(filterTerms))
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
