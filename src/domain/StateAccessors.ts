import * as _ from "lodash"
var update = require("react-addons-update")
var querystring = require("querystring")
 
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
			getKey:(str)=> key["exec"] ? _.last(key["exec"](str)) : key,  
			run:accessor
		})

	}
	
	setState(key, ...args){
		this.state[key] = args
	}
	
	removeFromState(key, val){
		if(this.state[key]){
			this.state[key] = _.without(this.state[key], val)
		}
	}
	inState(key, val){
		return this.state[key] && _.contains(this.state[key], val)
	}
	addToState(key, val){
		this.state[key] = this.state[key] || []
		this.state[key] = _.uniq(this.state[key].concat([val]))
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
				var formattedKey = accessor.getKey(key) 
				data = accessor.run.apply(accessor, [formattedKey, data].concat(this.state[key])) || data
			}
		});
		return data
	}
	
	toQueryString(){
		return querystring.stringify(this.state)
	}
	
	fromQueryString(str){
		this.state = querystring.parse(str)
	}
}
