import { State } from './State'
const isArray = require('lodash/isArray')
const take = require('lodash/take')
const size = require('lodash/size')
const without = require('lodash/without')
const indexOf = require('lodash/indexOf')
const update = require('immutability-helper')

export class LevelState extends State<Array<any>> {
  value: Array<any>

  getValue() {
    return this.value || []
  }

  add(level: number, val) {
    let ob = this.getValue()
    if (!isArray(ob[level])) {
      ob = update(ob, {
        [level]: { $set: [] }
      })
    }
    ob = update(ob, {
      [level]: { $push: [val] }
    })
    return this.create(ob)
  }

  contains(level: number, val) {
    return indexOf(this.getValue()[level], val) !== -1
  }

  clear(level = 0) {
    return this.create(take(this.getValue(), level))
  }

  remove(level: number, val) {
    return this.create(
      update(this.getValue(), {
        [level]: { $set: without(this.getValue()[level], val) }
      })
    )
  }

  toggle(level: number, val) {
    if (this.contains(level, val)) {
      return this.remove(level, val)
    }
    return this.add(level, val)
  }

  getLevel(level: number): Array<string> {
    return this.getValue()[level] || []
  }

  levelHasFilters(level: number): boolean {
    return this.getLevel(level).length > 0
  }

  getLeafLevel() {
    return size(this.value) - 1
  }

  isLeafLevel(level: number): boolean {
    return level === this.getLeafLevel()
  }

  toggleLevel(level, key): LevelState {
    if (this.contains(level, key)) {
      if (this.isLeafLevel(level)) {
        return this.clear(level)
      }
      return this.clear(level + 1)
    }
    return this.clear(level).add(level, key)
  }
}
