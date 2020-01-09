import { EventEmitter } from '../../../'

describe('EventEmitter', () => {
  beforeEach(() => {
    this.emitter = new EventEmitter()
  })

  it('constructor()', () => {
    expect(this.emitter.listeners).toEqual([])
  })

  it('add, trigger, remove, clear', () => {
    let argsStr = ''
    const fn = (...args) => {
      argsStr = args.join('')
    }
    const removeFn = this.emitter.addListener(fn)
    expect(this.emitter.listeners).toEqual([fn])
    this.emitter.trigger('a', 'b', 'c')
    expect(argsStr).toEqual('abc')

    removeFn()
    expect(this.emitter.listeners).toEqual([])
    this.emitter.addListener(fn)
    expect(this.emitter.listeners).toEqual([fn])
    this.emitter.clear()
    expect(this.emitter.listeners).toEqual([])
  })
})
