export function MatchPhrasePrefix(query, str) {
  if (!query) return
  const tokens = str.split('^')
  const field = tokens[0]
  const boost = Number(tokens[1] || 1)
  return {
    match_phrase_prefix: {
      [field]: { query, boost }
    }
  }
}
