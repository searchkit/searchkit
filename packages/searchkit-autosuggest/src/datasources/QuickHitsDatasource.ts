import { 
    MultiMatchQuery, TopHitsMetric, FilterBucket, SearchkitManager
} from "searchkit"

import map from "lodash/map"
import get from "lodash/get"

export type QuickHitsDatasourceOptions = {
    title:string
    id:string
}
export class QuickHitsDatasource {
    options:QuickHitsDatasourceOptions
    searchkit:SearchkitManager
    constructor(options) {
        this.options = options
    }
    isSearchkitSource() {
        return true
    }

    configure(searchkit) {
        this.searchkit = searchkit
    }

    search(query, queryString) {
        return query.setAggs(
            FilterBucket(
                this.options.id, MultiMatchQuery(queryString, {
                    type: "phrase_prefix",
                    fields: ["title"]
                }),
                TopHitsMetric('tophits', {
                    size: 3,
                    _source: ['title', 'imdbId']
                })
            )
        )
    }

    getGroupedResult(results) {
        let path = [
            'aggregations',
            this.options.id, 'tophits', 'hits', 'hits'
        ]
        let items = map(get(results, path, []), (item:any) => {
            return {
                key: item._source.title,
                select() {
                    let url = "http://www.imdb.com/title/" + item._source.imdbId
                    window.open(url, '_blank')
                }
            }
        })
        return {
            title: this.options.title,
            results: items
        }
    }
}