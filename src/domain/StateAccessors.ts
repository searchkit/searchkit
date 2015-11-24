import * as _ from "lodash"
var update = require("react-addons-update")
 
export default class StateAcessors {

	state:Object
	stateMatchers:Array<any>
	
	constructor(){
		this.state = {}
		this.stateMatchers = []
	}

	registerAccessor(key:string | RegExp, accessor:Function){
		this.stateMatchers.push({
			test:(str)=> key["test"] ? key["test"](str) : key === str,
			key:key,  
			run:accessor
		})

	}
	

	setState(key, ...args){
		this.state[key] = args
	}
	
	findAccessor(key){
		return _.find(
			this.stateMatchers, 
			(matcher)=> matcher.test(key)
		)			
	}
	
	getData(){
		var data = {}
		_.forIn(this.state, (value, key)=> {
			var accessor = this.findAccessor(key)
			if(accessor) {				
				data = accessor.run.apply(accessor, [key, data].concat(this.state[key])) || data
			}
		});
		return data
	}

}
