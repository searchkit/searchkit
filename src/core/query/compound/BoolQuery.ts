export function BoolMust(val:any){
  return {bool:{must:val}}
}

export function BoolMustNot(val:any){
  return {bool:{must_not:val}}
}

export function BoolShould(val:any){
  return {bool:{should:val}}
}
