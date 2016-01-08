import {LevelState} from "../state"
import {Accessor} from "./Accessor"
import {
  Term, Terms, Aggs,
  BoolShould, BoolMust,
  NestedFilter, AggsList
} from "../query/QueryBuilders";

export interface PathFacetAccessorOptions {
	field:string
	id:string
	title:string
}

export class NestedFacetAccessor extends Accessor<LevelState> {
	state = new LevelState()
	options:any

	constructor(key, options:PathFacetAccessorOptions){
		super(key, options.id)
		this.options = options
	}

	getBuckets(level) {
		const results = this.getResults()
    const rpath = ['aggregations',this.key, "lvl"+level,"parents",'buckets']
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

  buildOwnQuery(query){

    let aggs = {}
    let levelField = this.options.field+".level"
    let ancestorsField = this.options.field+".ancestors"
    let valueField = this.options.field+".value"

    var addLevel = (level, ancestors=[]) => {
      _.extend(aggs,
        AggsList(
          "lvl"+level,
          BoolMust([Term(levelField, level+1), ...ancestors]),
          {parents:Terms(valueField, {size:0})}
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
				nested: {
					path: this.options.field
				},
				aggs: aggs
			}
		})

    return query
  }

}
