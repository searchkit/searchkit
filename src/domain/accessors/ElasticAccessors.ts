import * as _ from "lodash"

export default class ElasticAccessors {


	static facetFilter(key, data, ...filters){
		if(!filters){
			return data
		}
		data = _.defaultsDeep(data, {
			filter:{bool:{must:[]}}
		})
		_.each(filters, (f)=> {
			data.filter.bool.must.push({
				term:{[key]:f}
			})
		})
		return data
	}

	static facetOrFilter(key, data, ...filters) {
		if(!filters){
			return data
		}
		data = _.defaultsDeep(data, {
			filter:{bool:{should:[]}}
		})
		_.each(filters, (f)=> {
			data.filter.bool.should.push({
				term:{[key]:f}
			})
		})
		return data
	}

}
