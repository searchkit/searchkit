import { GuidGenerator } from '../../../'

describe('GuidGenerator', () => {
  it('guid()', () => {
    const gen = new GuidGenerator()
    expect(gen.guid()).toEqual('1')
    expect(gen.guid('foo')).toEqual('foo2')
    gen.reset()
    expect(gen.guid('foo')).toEqual('foo1')
  })
})
