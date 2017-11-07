import {ValueState, SearchkitManager, QueryAccessor} from "searchkit"

export type QueryHandler = (queryString: string) => any | QueryAccessor

export interface QueryDelegate {
    register(searchkit)
    getValue(): String
    update(value: String)
    submit(value?: String)
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
        return (this.accessor.state.getValue() || "") as String
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
    value: String
    constructor(fn: Function) {
        this.queryFunction = fn
        this.value = ""
    }
    register() {

    }
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
    } else {
        return new QueryFunctionDelegate(handler)
    }
}
