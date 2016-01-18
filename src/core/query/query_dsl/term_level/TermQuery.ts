export function TermQuery(key, value){
  return {
    term:{
      [key]:value
    }
  }
}
