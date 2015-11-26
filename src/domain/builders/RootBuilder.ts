import * as _ from "lodash"


export default class RootBuilder {

	$$filters = {}
	filter:any

	addFilter(key, bool){
		this.$$filters[key] = bool
		_.defaultsDeep(this, {
			filter:{bool:{must:[]}}
		})
		this.filter.bool.must.push(bool)
		return this
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
