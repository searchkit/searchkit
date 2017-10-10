import {State} from "./State"
import isArray = require("lodash/isArray")
import take = require("lodash/take")
import size = require("lodash/size")
import without = require("lodash/without")
import indexOf = require("lodash/indexOf")
const update = require("immutability-helper")

export class LevelState extends State<Array<any>> {
  value:Array<any>

  getValue() {
    return this.value || []
  }

  add(level:number, val) {
    var ob = this.getValue()
    if (!isArray(ob[level])) {
      ob = update(ob, {
        [level]:{$set:[]}
      })
    }
    ob = update(ob, {
      [level]:{$push:[val]}
    })
    return this.create(ob)
  }

  contains(level:number, val) {
    return indexOf(this.getValue()[level], val) !== -1
  }

  clear(level:number=0) {
    return this.create(take(this.getValue(), level))
  }

  remove(level:number, val) {
    return this.create(update(this.getValue(), {
      [level]:{$set:without(this.getValue()[level], val)}
    }))
  }

  toggle(level:number, val) {
    if(this.contains(level, val)) {
      return this.remove(level, val);
    } else {
      return this.add(level, val);
    }
  }

  getLevel(level:number):Array<string> {
    return this.getValue()[level] || [];
  }

  levelHasFilters(level:number):boolean {
    return this.getLevel(level).length > 0;
  }

  getLeafLevel() {
    return size(this.value) -1;
  }

  isLeafLevel(level:number):boolean {
    return level === this.getLeafLevel()
  }

  toggleLevel(level, key):LevelState{

    if (this.contains(level, key)) {
      if (this.isLeafLevel(level)) {
        return this.clear(level);
      } else {
        return this.clear(level+1);
      }
    } else {
      return this.clear(level)
        .add(level, key)
    }

  }

}
