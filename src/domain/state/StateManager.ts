import * as _ from "lodash"
var update = require("react-addons-update")
var querystring = require("querystring")
import history from "../history.ts"
import Accessor from "../accessors/Accessor.ts";
import StateMap from "./StateMap.ts";
import RootBuilder from "../builders/RootBuilder.ts";
import ESClient from "../ESClient.ts";

export default class StateAcessors {

	state:StateMap
	stateAccessors:Array<Accessor>

	constructor(public searcher:ESClient){
		this.state = new StateMap()
		this.stateAccessors = []
	}

	registerAccessor(accessor:Accessor){
		accessor.setSearcher(this.searcher)
		accessor.setState(this.state.boundStateMap(accessor.key))
		this.stateAccessors.push(accessor)
		return accessor
	}

	invokeAccessors(method, ...args){
		_.each(this.stateAccessors, (accessor)=>{
			const stateArgs = this.state.get(accessor.key) || []
			accessor[method].apply(accessor, args.concat(stateArgs))
		});
	}

	getData(){
		var data = new RootBuilder()
		this.invokeAccessors("buildQuery", data)
		this.invokeAccessors("buildPostQuery", data)
		return data
	}

	updateHistory(){
		history.pushState(null, "/", this.state.getState())
	}
}
