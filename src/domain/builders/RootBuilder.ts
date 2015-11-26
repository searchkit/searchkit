import * as _ from "lodash"


export default class RootBuilder {

	$$filters = {}
	filter:any
	aggs:any
	query:any

	setQuery(query) {
		_.defaultsDeep(this, query); 
	}

	addFilter(key, bool){
		this.$$filters[key] = bool
		_.defaultsDeep(this, {
			filter:{bool:{must:[]}}
		})
		this.filter.bool.must.push(bool)
		return this
	}

	getFilters(key=undefined){
		return _.values(_.omit(this.$$filters, [key]))
	}


	setAggs(key, aggs){
		this.aggs = this.aggs || {}
		this.aggs[key] = aggs
	}

	getJSON(){
		const replacer = (key, value) => {
			if(/^\$\$/.test(key)){
				return undefined
			} else {
				return value
			}
		}
		return JSON.parse(JSON.stringify(this, replacer))
	}
}
