import {Accessor} from "./Accessor";
import {get} from "lodash"

export class SuggestionsAccessor extends Accessor {

  constructor(public field:string){
    super()
  }

  getSuggestion(){
    return get(this.searchkit.getSuggestions(), [0,"options", 0, "text"], false)
  }

  buildOwnQuery(query) {
    let queryText = query.getQueryString()
    if(queryText.length > 3){
      return query.setSuggestions({
        text:queryText,
        suggestions:{
          phrase: {
            field:this.field,
            real_word_error_likelihood : 0.95,
            max_errors : 1,
            gram_size : 4,
            direct_generator : [{
              field : "_all",
              suggest_mode : "always",
              min_word_length : 1
            }]
          }
        }
      })
    }
    return query
  }
}
