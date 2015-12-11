import {ObjectState, ArrayState} from "../state/State"
import {Accessor} from "./Accessor"
import {Term, Terms, BoolShould, BoolMust} from "../query/QueryBuilders";
import * as _ from "lodash";
const update = require("react-addons-update")


export class HierarchicalState extends ObjectState {
  value:Object
  defaultValue:Object


  add(level:number, val) {
    var ob = this.lazyInit()
    if (!_.isArray(ob[level])) {
      ob = update(ob, {
        [level]:{$set:[]}
      })
    }
    ob = update(ob, {
      [level]:{$push:[val]}
    })
    return this.create(ob)
  }

  contains(level:number, val) {
    return _.contains(this.lazyInit()[level], val)
  }

  clear(level?:number) {
    console.log(level)
    if (!level) {
      return this.create([])
    } else if(level) {
      return this.create(update(this.lazyInit(), {
        [level]:{$set:[]}
      }))
    }
  }

  remove(level:number, val) {
    return this.create(update(this.lazyInit(), {
      [level]:{$set:_.without(this.lazyInit()[level], val)}
    }))
  }

  toggle(level:number, val) {
    if(this.contains(level, val)) {
      return this.add(level, val);
    } else {
      return this.remove(level, val);
    }
  }

  getLevel(level:number):Array<string> {
    return this.lazyInit()[level] || [];
  }

  levelHasFilters(level:number):boolean {
    return this.getLevel(level).length > 0;
  }

  removeChilds(level:number) {
    debugger
    var c = _.map(_.range(level+1,this.getLeafLevel()),(level) => {
      this.clear(level)
    })
    return this.create(_.last(c));
  }

  getLeafLevel() {
    return _.size(this.value) -1;
  }

  isLeafLevel(level:number):boolean {
    return level === this.getLeafLevel()
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
