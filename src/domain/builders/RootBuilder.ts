import * as _ from "lodash"


export default class RootBuilder {

	$$filters = {}
	filter:any
	aggs:any
	query:any
	size:number
	from:number

	constructor() {
		this.setSize(10);
	}

	setQuery(query) {
		_.defaultsDeep(this, query);
	}

	setSize(size:number) {
		this.size = size;
	}

	setFrom(from:number) {
		this.from = from;
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
		if (!_.isArray(key)) {
			key = [key];
		}
		const filters =  _.values(_.omit(this.$$filters, key))
		return {bool:{must:filters}}
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
