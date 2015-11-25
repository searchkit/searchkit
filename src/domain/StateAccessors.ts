import * as _ from "lodash"
var update = require("react-addons-update")
var querystring = require("querystring")
import history from "./history.ts"

export interface StateAccessorRef {
	set(val:string):void
	get():Array<any>
	add(val:string):void
	remove(val:string):void
	toggle(val:string):void
	clear(val:string):void
	contains(val:string):boolean
}

export default class StateAcessors {

	state:Object
	stateAccessors:Object

	constructor(){
		this.state = {}
		this.stateAccessors = {}
	}

	registerAccessor(key:string, accessor:Function):StateAccessorRef{
		this.stateAccessors[key] = accessor			
		return {
			set:this.setState.bind(this, key),
			add:this.addToState.bind(this, key),
			remove:this.removeFromState.bind(this,key),
			toggle:this.toggleState.bind(this,key),
			clear:this.clearState.bind(this, key),
			contains:this.inState.bind(this, key),
			get:this.getState.bind(this,key)
		}
	}
	
	getState(key){
		return this.state[key]
	}
	
	clearAll(){
		this.state = {}
	}
	
	clearState(key){
		delete this.state[key]
		this.updateHistory()
	}
	
	overwriteState(state){
		this.state = state
	}
	
	setState(key, ...args){
		this.state[key] = args
		this.updateHistory()
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
			this.updateHistory()
		}
	}
	inState(key, val){
		return this.state[key] && _.contains(this.state[key], val)
	}
	addToState(key, val){
		this.state[key] = this.state[key] || []
		this.state[key] = _.uniq(this.state[key].concat([val]))
		this.updateHistory()
	}

	getData(){
		var data = {}
		_.forIn(this.stateAccessors, (accessor, key)=> {
			var stateArgs = this.state[key]
			data = accessor.apply(accessor, [key, data].concat(stateArgs || [])) || data			
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
