import * as _ from "lodash"

export class ElasticAccessors {


	static facetFilter(key, data, ...filters){
		data = _.defaults(data, {
			query:{bool:{filters:[]}}
		})
		_.each(filters, (f)=> {
			data.query.bool.filters.push({
				term:{[key]:f}
			})
		})
		return data
	}

}
