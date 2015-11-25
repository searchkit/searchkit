import * as axios from "axios"
import * as _ from "lodash"
import * as rx from "rx";
import StateAccessors from "./StateAccessors.ts"
import ElasticAccessors from "./accessors/ElasticAccessors.ts"

export default class ESClient {

	query:any
	results:any
	resultsListener: rx.ReplaySubject<any>
  accessors:StateAccessors
	private registrationCompleted:Promise<any>
	completeRegistration:Function
	constructor(public host:string, public index:string){
		this.results = {}
		this.resultsListener = new rx.ReplaySubject(1)
    this.accessors = new StateAccessors()
		this.query = {
			filter:{},
			aggs:{}
		}
		this.registrationCompleted = new Promise((resolve)=>{
			this.completeRegistration = resolve
		})
	}

  setStateQuery(stateQuery){
    this.accessors.overwriteState(stateQuery)
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
		if (_.has(this.query, "filter.bool.filter")) {
			return !!_.find(this.query.filter.bool.filter, this.filterMatch.bind(this, name, value))
		} else {
			return false;
		}
	}

	toggleFilter(name:string, value:string):void {
		_.defaultsDeep(this.query, {
			filter:{bool:{filter:[]}}
		})

		if (!this.hasFilter(name,value)) {

			this.query.filter.bool.filter.push({
				"term": {
					[name]:value
				}
			})

		} else {
			_.remove(this.query.filter.bool.filter, this.filterMatch.bind(this, name, value));
		}
	}

	setAggs(name:string, aggs:Object) {
		this.query.aggs[name] = aggs
	}

	getQuery(){
		return _.extend({}, this.query, this.accessors.getData())
	}
	search(){
		this.registrationCompleted.then(()=> {
			const query = this.getQuery()
			console.log(query)
			return axios.post(this.searchUrl(), query)
				.then((response)=>{
					this.results = response.data
					console.log(this.results)
					this.resultsListener.onNext(this.results)
					return this.results
				})
		})

	}

}
