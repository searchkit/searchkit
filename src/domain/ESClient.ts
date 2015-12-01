import * as axios from "axios"
import * as _ from "lodash"
import * as rx from "rx";
import StateManager from "./state/StateManager.ts";

export default class ESClient {

	query:any
	results:any
	resultsListener: rx.ReplaySubject<any>
  stateManager:StateManager
	private registrationCompleted:Promise<any>
	completeRegistration:Function
	constructor(public host:string, public index:string){
		this.results = {}
		this.resultsListener = new rx.ReplaySubject(1)
    this.stateManager = new StateManager(this)
		this.registrationCompleted = new Promise((resolve)=>{
			this.completeRegistration = resolve
		})
	}

  setStateQuery(stateQuery){
    this.stateManager.state.setState(stateQuery)
  }

	searchUrl(){
		// return [this.host, this.index, "_search"].join("/")
		return "/api/search/"+this.index
	}

	getQuery(){
		return this.stateManager.getData().getJSON()
	}
	
	listenToHistory(history){
		history.listen((location)=>{	
			this.setStateQuery(location.query)			
			this.search()
		})
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
