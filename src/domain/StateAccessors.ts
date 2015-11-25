import * as _ from "lodash"
var update = require("react-addons-update")
var querystring = require("querystring")
import history from "./history.ts"

export interface StateAccessorRef {
	set(val:string)
	add(val:string)
	remove(val:string)
	toggle(val:string)
	clear(val:string)
}

export default class StateAcessors {

	state:Object
	stateMatchers:Array<any>

	constructor(){
		this.state = {}
		this.stateMatchers = []
	}

	registerAccessor(key:string | RegExp, accessor:Function):StateAccessorRef{
		this.stateMatchers.push({
			test:(str)=> key["test"] ? key["test"](str) : key === str,
			getKey:(str)=> key["exec"] ? _.last(key["exec"](str)) : key,
			run:accessor
		})

		return {
			set:this.setState.bind(this, key),
			add:this.addToState.bind(this, key),
			remove:this.removeFromState.bind(this,key),
			toggle:this.toggleState.bind(this,key),
			clear:this.clearState.bind(this, key)
		}
	}
	
	clearAll(){
		this.state = {}
	}
	
	clearState(key){
		delete this.state[key]
	}
	
	overwriteState(state){
		this.state = state
	}
	
	setState(key, ...args){
		this.state[key] = args
	}

	toggleState(key, val){
		if(this.inState(key, val)){
			this.removeFromState(key,val)
		} else {
			this.addToState(key, val)
		}
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

	updateHistory(){
		history.pushState(null, "/", this.state)
	}
	
	fromQueryString(str){
		this.state = querystring.parse(str)
	}
}
