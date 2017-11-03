import { NestedFacetAccessor, TopHitsMetric, BoolMust, FilterBucket, NestedQuery, NestedBucket, TermsBucket, LevelState } from "searchkit";
import { createRegexQuery } from "../Utils";
import get from "lodash/get";
import last from "lodash/last";
export class HierarchicalRefinementDatasource {
    constructor(options) {
        this.options = options;
    }
    isSearchkitSource() {
        return true;
    }
    configure(searchkit) {
        this.searchkit = searchkit;
        if (this.options.accessorId) {
            let accessor = searchkit.accessors.statefulAccessors[this.options.accessorId];
            if (!accessor) {
                console.error(`Could not create facet filter datasource with accessorId=${this.options.accessorId}`);
            }
            else {
                this.originalAccessor = accessor;
            }
        }
        else {
            let { id, field, startLevel, title } = this.options;
            this.originalAccessor = new NestedFacetAccessor(id, {
                id, field, startLevel, title
            });
            this.searchkit.addAccessor(this.originalAccessor);
        }
        this.delegateAccessor = this.createDelegate(this.originalAccessor);
    }
    createDelegate(accessor) {
        let delegateAccessor = new NestedFacetAccessor(accessor.options.id, Object.assign({}, accessor.options));
        delegateAccessor.uuid = accessor.options.id;
        return delegateAccessor;
    }
    search(query, queryString) {
        const { field, startLevel } = this.delegateAccessor.options;
        const regexpQuery = {
            regexp: {
                [field + ".value"]: createRegexQuery(queryString)
            }
        };
        return query.setAggs(FilterBucket(this.delegateAccessor.uuid, BoolMust([
            // query.getFilters(),
            NestedQuery(field, regexpQuery)
        ]), NestedBucket("children", field, FilterBucket("filtered", BoolMust([
            regexpQuery,
            {
                "range": {
                    [field + ".level"]: {
                        gte: startLevel
                    }
                }
            }
        ]), TermsBucket("terms", field + ".value", {
            size: 5
        }, TopHitsMetric("hits", {
            _source: [field + ".ancestors"],
            size: 1
        }))))));
    }
    onSelect(item) {
        const { startLevel } = this.delegateAccessor.options;
        // this.originalAccessor.state = new LevelState()
        let levels = item.ancestors.slice(startLevel - 1).concat(item._key).map((key) => {
            return [key];
        });
        this.originalAccessor.state = new LevelState(levels);
        this.searchkit.performSearch();
    }
    getGroupedResult(results) {
        let buckets = get(results, [
            "aggregations", this.delegateAccessor.uuid,
            "children", "filtered", "terms",
            "buckets"
        ], []);
        buckets = buckets.map((item) => {
            item.select = () => {
                this.onSelect(item);
            };
            item.ancestors = get(item, "hits.hits.hits[0]._source.taxonomy.ancestors", []);
            item._key = item.key;
            if (item.ancestors.length > 1) {
                item.key += " - " + last(item.ancestors);
            }
            return item;
        });
        return {
            title: this.delegateAccessor.options.title,
            onSelect: () => { },
            results: buckets
        };
    }
}
//# sourceMappingURL=HierarchicalRefinementDatasource.js.map