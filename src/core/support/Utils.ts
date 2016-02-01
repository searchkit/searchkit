const reduce = require("lodash/reduce")

export class Utils {
  static guid(){
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  }

  static collapse(collection, seed){
    const reducer = (current, fn)=> fn(current)
    return reduce(collection, reducer, seed)
  }

  static instanceOf(klass){
    return (val)=> val instanceof klass
  }

  static interpolate(str, interpolations){
    return str.replace(
  		/{([^{}]*)}/g,
  		(a, b) => {
  			var r = interpolations[b];
  			return typeof r === 'string' || typeof r === 'number' ? r : a;
  		}
    )
  }

  static translate(key, interpolations?){
    if(interpolations){
      return Utils.interpolate(key, interpolations)
    } else {
      return key
    }
  }

  static autobind(target, key, descriptor){
    let fn = descriptor.value
    return {
      get:function(){
        return fn.bind(this)
      }
    }
  }
}
