import * as _ from "lodash"
var update = require("react-addons-update")
var querystring = require("querystring")
import history from "../history"
import Accessor from "../accessors/Accessor";
import StateMap from "./StateMap";
import RootBuilder from "../builders/RootBuilder";
import ESClient from "../ESClient";
import Newable from "../../common/Newable";

export default class StateAcessors {

	state:StateMap
	stateAccessors:Array<Accessor>

	constructor(public searcher:ESClient){
		this.state = new StateMap()
		this.stateAccessors = []
	}

	registerAccessor<T extends Accessor>(accessor:T): T{
		accessor.setSearcher(this.searcher)
		accessor.setState(this.state.boundStateMap(accessor.key))
		this.stateAccessors.push(accessor)
		return accessor
	}

	findAccessorsByClass<T extends Accessor>(accessorClass:Newable<T>):Array<T> {
		return _.filter(this.stateAccessors, (accessor)=>{
			return accessor instanceof accessorClass
		}) as Array<T>
	}

	invokeAccessors(method, ...args){
		_.each(this.stateAccessors, (accessor)=>{
			const stateArgs = this.state.get(accessor.key) || []
			accessor[method].apply(accessor, args.concat(stateArgs))
		});
	}

	searchReset(){
		_.invoke(this.stateAccessors, "searchReset")
	}

	getData(){
		var data = new RootBuilder()
		this.invokeAccessors("buildQuery", data)
		this.invokeAccessors("buildPostQuery", data)
		return data
	}

	updateHistory(){		
		history.pushState(null, window.location.pathname, this.state.getState())
	}
}
