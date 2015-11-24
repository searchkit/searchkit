import * as _ from "lodash"
var update = require("react-addons-update")
 
export default class StateAcessors {

	state:Object
	stateAccessors:Object

	constructor(){
		this.state = {}
		this.stateAccessors = {}
	}

	registerAccessor(key:string, accessor:Function){
		this.stateAccessors[key] = accessor
	}

	setState(key, ...args){
		this.state[key] = args
	}

	getData(){
		var data = {}
		_.forIn(this.stateAccessors, (accessor, key)=> {
			data = accessor.apply(accessor, [data].concat(this.state[key])) || data
		});
		return data
	}

}
