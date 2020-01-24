import { AnonymousAccessor, ImmutableQuery } from '../../../'

describe('AnonymousAccessor', () => {
  it('should override buildSharedQuery', () => {
    const accessor = new AnonymousAccessor((query) => query.setSize(11))
    const query = accessor.buildSharedQuery(new ImmutableQuery())
    expect(query.getSize()).toBe(11)
  })

  it('should handle null fn', () => {
    const accessor = new AnonymousAccessor(null)
    const query = new ImmutableQuery()
    expect(accessor.buildSharedQuery(query)).toBe(query)
  })
})
