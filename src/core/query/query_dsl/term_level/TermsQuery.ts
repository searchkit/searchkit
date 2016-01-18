export function TermsQuery(key, value:Array<any>){
  return {
    terms:{
      [key]:value
    }
  }
}
