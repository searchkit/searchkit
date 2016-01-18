export interface FilteredQueryOptions {
  filter?:any
  query?:any
}
export function FilteredQuery(filtered:FilteredQueryOptions){
  return {filtered}
}
