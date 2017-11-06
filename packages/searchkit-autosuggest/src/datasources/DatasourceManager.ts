import { SearchkitDatasourceManager } from "./SearchkitDatasourceManager"
import { SearchkitManager } from "searchkit"

import { Source, DataSource, SuggestGroup, SearchkitDatasource } from "./Types"
import each from "lodash/each"
import flatten from "lodash/flatten"

export class DatasourceManager {
    searchkit: SearchkitManager
    sources: Array<DataSource>
    searchkitDatasource: SearchkitDatasourceManager

    constructor(searchkit, sources:Array<Source>=[]) {
        this.searchkit = searchkit
        this.searchkitDatasource = new SearchkitDatasourceManager(searchkit)

        this.sources = [this.searchkitDatasource]
        each(sources, (source) => {
            if (source.isSearchkitSource()) {
                this.searchkitDatasource.addSource(source)
            } else {
                this.sources.push(source as DataSource)
            }
        })
    }


    async search(query):Promise<Array<SuggestGroup>> {
        let results = await Promise.all(this.sources.map((source) => {
            return source.search(query)
        }))
        return flatten(results)        
    }
}