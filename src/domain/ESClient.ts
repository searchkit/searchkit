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
	}

	searchUrl(){
		return [this.host, this.index, "_search"].join("/")
	}

	setQuery(query){
		this.query = query
	}

	search(){
		return axios.post(this.searchUrl(), this.query)
			.then((response)=>{
				this.results = response.data
				console.log(this.results)
				this.resultsListener.onNext(this.results)
				return this.results
			})
	}

}
