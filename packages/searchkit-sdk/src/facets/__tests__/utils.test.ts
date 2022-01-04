import { createRegexQuery } from '../utils/index'

describe('create regex query', () => {
  it('for one word query', () => {
    expect(createRegexQuery('t')).toBe('[tT].*')
  })
  it('for two words query', () => {
    expect(createRegexQuery('ti')).toBe('[tT][iI].*')
  })
  it('for three words query', () => {
    expect(createRegexQuery('tim')).toBe('([a-zA-Z]+ )+?[tT][iI][mM].*')
  })
})
