import * as _ from "lodash"
export class Utils {
  static guid(){
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  }

  static collapse(collection, seed){
    const reducer = (current, fn)=> fn(current)
    return _.reduce(collection, reducer, seed)
  }
}
