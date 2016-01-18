export function NestedQuery(path, filter){
  return {
    nested:{
      path, filter      
    }
  }
}
