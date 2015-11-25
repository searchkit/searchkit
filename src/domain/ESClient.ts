import * as axios from "axios"
import * as _ from "lodash"
import * as rx from "rx";

export default class ESClient {

	query:any
	results:any
	resultsListener: rx.ReplaySubject<any>

	constructor(public host:string, public index:string){
		this.results = {}
		this.resultsListener = new rx.ReplaySubject(1)
		this.query = {
			aggs:{}
		}
	}

	searchUrl(){
		return [this.host, this.index, "_search"].join("/")
	}

	setQuery(query:Object){
		if (query === null) {
			delete this.query.query;
		} else {
			this.query.query = query;
		}
	}

	filterMatch(name:string, value:string, filter:any):boolean {
		return filter.term[name] === value;
	}

	hasFilter(name:string, value:string):boolean {
		if (_.has(this.query, "query.bool.filter")) {
			return !!_.find(this.query.query.bool.filter, this.filterMatch.bind(this, name, value))
		} else {
			return false;
		}
	}

	toggleFilter(name:string, value:string):void {
		_.defaultsDeep(this.query, {
			query:{bool:{filter:[]}}
		})

		if (!this.hasFilter(name,value)) {

			this.query.query.bool.filter.push({
				"term": {
					[name]:value
				}
			})

		} else {
			_.remove(this.query.query.bool.filter, this.filterMatch.bind(this, name, value));
		}
	}

	setAggs(name:string, aggs:Object) {
		this.query.aggs[name] = aggs
	}

	search(){
		console.log(this.query)
		return axios.post(this.searchUrl(), this.query)
			.then((response)=>{
				this.results = response.data
				console.log(this.results)
				this.resultsListener.onNext(this.results)
				return this.results
			})
	}

}
