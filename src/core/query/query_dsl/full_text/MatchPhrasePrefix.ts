export function MatchPhrasePrefix(query, str){
  if(!query) return    
  let tokens = str.split("^")
  let field = tokens[0]
  let boost = Number(tokens[1] || 1)
  return {
    "match_phrase_prefix":{
      [field]:{query, boost}
    }
  }
}
