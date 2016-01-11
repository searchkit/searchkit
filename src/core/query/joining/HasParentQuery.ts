export function HasParentQuery(parent_type, query){
  return {
    has_child:{
      parent_type, query
    }
  }
}
