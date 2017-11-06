import {
    AccessorManager, ImmutableQuery,
    SearchkitManager, ESTransport
} from "searchkit"

import { Source, SuggestGroup, DataSource } from "./Types"
import { createRegexQuery } from "../Utils"

import reduce from "lodash/reduce"
import map from "lodash/map"
import orderBy from "lodash/orderBy"
import filter from "lodash/filter"
import get from "lodash/get"

export class SearchkitDatasourceManager implements DataSource {
    searchkit: SearchkitManager
    transport: ESTransport
    sources: Array<any>
    results: Object
    constructor(searchkit) {
        this.searchkit = searchkit
        this.transport = searchkit.transport
        this.sources = []
    }

    isSearchkitSource(){
        return true
    }

    addSource(source) {
        source.configure(this.searchkit)
        this.sources.push(source)
    }

    async search(query = "") {
        let sharedQuery = this.searchkit.accessors.buildSharedQuery(new ImmutableQuery())
            .setSize(0)
        let searchQuery = reduce(this.sources, (searchQuery, source) => {
            return source.search(searchQuery, query)
        }, sharedQuery)
        this.results = await this.transport.search(searchQuery.getJSON())
        return this.getGroupedResults()
    }

    getGroupedResults():Array<SuggestGroup> {
        let results = map(this.sources, (source) => {
            return source.getGroupedResult(this.results)
        })
        results = filter(results, (item) => {
            return item.results.length > 0
        })
        return results
    }
}