export function HasChildQuery(type, query){
  return {
    has_child:{
      type, query
    }
  }
}
