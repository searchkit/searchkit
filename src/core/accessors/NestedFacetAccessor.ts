import {LevelState} from "../state"
import {Accessor} from "./Accessor"
import {
  Term, Terms, Aggs,
  BoolShould, BoolMust,
  NestedFilter, AggsList
} from "../query/QueryBuilders";

export interface NestedFacetAccessorOptions {
	field:string
	id:string
	title:string
  orderKey?:string
  orderDirection?:string
  startLevel?:number
}

export class NestedFacetAccessor extends Accessor<LevelState> {
	state = new LevelState()
	options:any

	constructor(key, options:NestedFacetAccessorOptions){
		super(key, options.id)
		this.options = options
	}

	getBuckets(level) {
		const results = this.getResults()
    const rpath = ['aggregations',this.key, "parents", "lvl"+level,"parents",'buckets']
    return _.get(results, rpath, [])
	}

	buildSharedQuery(query) {

		let levelFilters = this.state.getValue()
		let lastIndex = levelFilters.length - 1
		var filterTerms = _.map(levelFilters, (filter,i) => {

			let value = filter[0]
			let isLeaf = i === lastIndex
			let subField = isLeaf ? ".value" : ".ancestors"
			return Term(this.options.field + subField, value, {
				$name:this.options.title || this.translate(this.key),
				$value:this.translate(value),
				$id:this.options.id,
				$disabled: !isLeaf,
				$remove:()=> {
					this.state = this.state.clear(i)
		    }
			})
		})

		if(filterTerms.length > 0){
      query = query.addFilter(this.options.field,
				NestedFilter(this.options.field, BoolMust(filterTerms)))
    }

    return query
  }

  getTermAggs(){
    let subAggs = undefined
    let orderMetric = undefined
    if(this.options.orderKey){
      let orderDirection = this.options.orderDirection || "asc"
      let orderKey = this.options.orderKey
      if(_.includes(["_count", "_term"], orderKey)) {
        orderMetric = {[orderKey]:orderDirection}
      } else {
        if(_.startsWith(orderKey, this.options.field + ".")){
          const subAggName = this.options.field + "_order"
          orderMetric = {
            [subAggName]:orderDirection
          }
          subAggs = {
            [subAggName]:{
              "min":{field:orderKey}
            }
          }
        }
      }
    }
    let valueField = this.options.field+".value"

    return {
      parents:_.extend(
        Terms(valueField, {size:0, order:orderMetric}),
        {aggs:subAggs}
      )
    }
  }

  buildOwnQuery(query){

    let aggs = {}
    let levelField = this.options.field+".level"
    let ancestorsField = this.options.field+".ancestors"
    let startLevel = this.options.startLevel || 1
    let termAggs = this.getTermAggs()
    var addLevel = (level, ancestors=[]) => {
      _.extend(aggs,
        AggsList(
          "lvl"+level,
          BoolMust([Term(levelField, level+startLevel), ...ancestors]),
          termAggs
        )
      )
    }

    addLevel(0)

		let levels = this.state.getValue()

		_.each(levels, (level,i) => {

			let ancestors = _.map(_.take(levels, i+1), (level)=>{
				return Term(ancestorsField, level[0])
			})

      addLevel(i+1, ancestors)

    })

		query = query.setAggs({
			[this.options.id]: {
        filter:query.getFilters(this.options.id),
        aggs:{
          parents:{
            nested: {
              path: this.options.field
            },
            aggs: aggs
          }
        }
      }
		})

    return query
  }

}
