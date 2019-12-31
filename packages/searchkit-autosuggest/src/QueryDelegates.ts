import { ValueState, SearchkitManager, QueryAccessor } from 'searchkit'

export type QueryFunction = (query: string) => any
export type QueryHandler = QueryAccessor | QueryFunction

export interface QueryDelegate {
  register(searchkit)
  getValue(): string
  update(value: string)
  submit(value?: string)
}

export class QueryAccessorDelegate implements QueryDelegate {
  accessor: QueryAccessor
  searchkit: SearchkitManager
  constructor(queryAccessor: QueryAccessor) {
    this.accessor = queryAccessor
  }
  register(searchkit) {
    this.searchkit = searchkit
    searchkit.addAccessor(this.accessor)
  }
  getValue() {
    return (this.accessor.state.getValue() || '') as string
  }
  update(value) {
    this.accessor.state = new ValueState(value)
  }
  submit(value = this.getValue()) {
    this.update(value)
    this.searchkit.performSearch()
  }
}

export class QueryFunctionDelegate {
  queryFunction: Function
  value: string
  constructor(fn: Function) {
    this.queryFunction = fn
    this.value = ''
  }
  register() {}
  getValue() {
    return this.value
  }
  update(value) {
    this.value = value
  }
  submit(value = this.value) {
    this.update(value)
    this.queryFunction(value)
  }
}

export const queryDelegateFactory = (handler: QueryHandler): QueryDelegate => {
  if (handler instanceof QueryAccessor) {
    return new QueryAccessorDelegate(handler)
  }
  return new QueryFunctionDelegate(handler)
}
