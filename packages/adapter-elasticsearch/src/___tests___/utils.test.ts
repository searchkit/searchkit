import { createRegexQuery } from '../utils'

describe('utils', () => {
  describe('createRegexQuery', () => {
    it('should create regex', () => {
      expect(createRegexQuery('test')).toBe('([a-zA-Z]+ )+?[tT][eE][sS][tT].*')
    })

    it('should create empty regex', () => {
      expect(createRegexQuery('')).toBe('.*')
    })

    it('should create empty regex', () => {
      expect(createRegexQuery('a')).toBe('[aA].*')
    })

    it('should be case insensitive for uppercase input', () => {
      expect(createRegexQuery('Hey')).toBe('([a-zA-Z]+ )+?[hH][eE][yY].*')
      expect(createRegexQuery('HeY')).toBe('([a-zA-Z]+ )+?[hH][eE][yY].*')
      expect(createRegexQuery('HEY')).toBe('([a-zA-Z]+ )+?[hH][eE][yY].*')
    })

    // https://github.com/searchkit/searchkit/issues/1423
    it('should escape Lucene regex operators', () => {
      expect(createRegexQuery('R&B')).toBe('([a-zA-Z]+ )+?[rR]\\&[bB].*')
      expect(createRegexQuery('C#')).toBe('[cC]\\#.*')
      expect(createRegexQuery('@~')).toBe('\\@\\~.*')
      expect(createRegexQuery('<a>')).toBe('([a-zA-Z]+ )+?\\<[aA]\\>.*')
      expect(createRegexQuery('"x"')).toBe('([a-zA-Z]+ )+?\\"[xX]\\".*')
    })
  })
})
