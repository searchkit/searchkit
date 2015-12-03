const update = require("react-addons-update")
import {BoolMust} from "./Builders.ts"

export class ImmutableQuery {
  index:any
  query:any
  static defaultQuery:any = {
	   filter:BoolMust([]),
     query:BoolMust([])
	}
  constructor(query=ImmutableQuery.defaultQuery, index={}){
    this.index = index
    this.query = query
  }

  addQuery(query){
    if(query){
      return this.update({
        query:BoolMust({$merge:[query]})
      })
    }
    return this
  }

  addFilter(key, bool){
    var addedIndex = {filters:{[key]:bool}}
    var newIndex = _.extend({}, addedIndex)

    return this.update({
      filter:BoolMust({$merge:[bool]})
    }, newIndex)

  }

  setAggs(aggs){
    return this.update({$merge:{aggs}})
  }

  getFilters(key=undefined){
		if (!_.isArray(key)) {
			key = [key];
		}
		const filters =  _.values(_.omit(this.index.filters || {}, key))
		return {bool:{must:filters}}
	}

  setSize(size:number){
    return this.update({$merge:{size}})
  }
  setFrom(from:number){
    return this.update({$merge:{from}})
  }

  update(updateDef, newIndex=this.index){
    return new ImmutableQuery(
      update(this.query, updateDef),
      newIndex
    )
  }

  static areQueriesDifferent(queryA:ImmutableQuery, queryB:ImmutableQuery){
    if(!queryA || !queryB){
      return true
    }

    return !_.isEqual(queryA.getJSON(), queryB.getJSON())
  }

  getJSON(){
		const replacer = (key, value) => {
			if(/^\$\$/.test(key)){
				return undefined
			} else {
				return value
			}
		}
		return JSON.parse(JSON.stringify(this.query, replacer))
	}
}
