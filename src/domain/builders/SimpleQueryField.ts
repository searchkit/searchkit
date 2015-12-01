export default class SimpleQueryField {
  query:Object = {}

  set(query:string) {
    this.query = {
      bool:{must:[{
        "simple_query_string": {
          "query":query,
          "default_operator":"and"
        }          
      }]}
      
    }
  }
}
