var _this = this;
var _1 = require("../../../");
var _ = require("lodash");
describe("NestedFacetAccessor", function () {
    beforeEach(function () {
        _this.searcher = new _1.Searcher(new _1.SearchkitManager('/'));
        _this.accessor = new _1.NestedFacetAccessor("categories", {
            field: "taxonomy",
            id: "categories",
            title: "Categories"
        });
        _this.accessor.setSearcher(_this.searcher);
        _this.query = new _1.ImmutableQuery();
        _this.toPlainObject = function (ob) {
            return JSON.parse(JSON.stringify(ob));
        };
    });
    it("getBuckets()", function () {
        _this.searcher.results = {
            aggregations: {
                "categories": {
                    "parents": {
                        "lvl1": {
                            parents: {
                                buckets: [1, 2, 3]
                            }
                        },
                        "lvl2": {
                            parents: {
                                buckets: [4, 5, 6]
                            }
                        }
                    }
                }
            }
        };
        expect(_this.accessor.getBuckets(1))
            .toEqual([1, 2, 3]);
        expect(_this.accessor.getBuckets(2))
            .toEqual([4, 5, 6]);
        expect(_this.accessor.getBuckets(4))
            .toEqual([]);
    });
    it("buildSharedQuery", function () {
        _this.accessor.state = _this.accessor.state
            .add(0, "lvl1val")
            .add(1, "lvl2val")
            .add(2, "lvl3val");
        expect(_this.toPlainObject(_this.accessor.state.getValue()))
            .toEqual([["lvl1val"], ['lvl2val'], ["lvl3val"]]);
        //
        var query = _this.accessor.buildSharedQuery(_this.query);
        var filters = _.chain(query.query.filter.$array)
            .pluck("$array")
            .flatten().value();
        expect(_this.toPlainObject(filters)).toEqual([
            {
                "term": {
                    "taxonomy.ancestors": "lvl1val"
                },
                "$disabled": true,
                "$name": "Categories",
                "$value": "lvl1val",
                "$id": "categories"
            },
            {
                "term": {
                    "taxonomy.ancestors": "lvl2val"
                },
                "$disabled": true,
                "$name": "Categories",
                "$value": "lvl2val",
                "$id": "categories"
            },
            {
                "term": {
                    "taxonomy.value": "lvl3val"
                },
                "$disabled": false,
                "$name": "Categories",
                "$value": "lvl3val",
                "$id": "categories"
            }
        ]);
        filters[2].$remove();
        query = _this.accessor.buildSharedQuery(_this.query);
        filters = _.chain(query.query.filter.$array)
            .pluck("$array")
            .flatten().value();
        expect(_this.toPlainObject(filters)).toEqual([
            {
                "term": {
                    "taxonomy.ancestors": "lvl1val"
                },
                "$disabled": true,
                "$name": "Categories",
                "$value": "lvl1val",
                "$id": "categories"
            },
            {
                "term": {
                    "taxonomy.value": "lvl2val"
                },
                "$disabled": false,
                "$name": "Categories",
                "$value": "lvl2val",
                "$id": "categories"
            }
        ]);
    });
    it("buildOwnQuery()", function () {
        var getFilters = function (aggs) {
            var filters = _.map(aggs.filter.$array, function (f) { return { term: f.term }; });
            return filters;
        };
        _this.accessor.state = _this.accessor.state
            .add(0, "lvl1val")
            .add(1, "lvl2val")
            .add(2, "lvl3val");
        var query = _this.accessor.buildSharedQuery(_this.query);
        query = _this.accessor.buildOwnQuery(query);
        //lvl1
        var lvl1Aggs = query.query.aggs.categories.aggs.parents.aggs.lvl1;
        expect(getFilters(lvl1Aggs)).toEqual([
            {
                term: {
                    "taxonomy.level": 2
                }
            },
            {
                term: {
                    "taxonomy.ancestors": "lvl1val"
                }
            },
        ]);
        var lvl2Aggs = query.query.aggs.categories.aggs.parents.aggs.lvl2;
        expect(getFilters(lvl2Aggs)).toEqual([
            {
                term: {
                    "taxonomy.level": 3
                }
            },
            {
                term: {
                    "taxonomy.ancestors": "lvl1val"
                }
            },
            {
                term: {
                    "taxonomy.ancestors": "lvl2val"
                }
            },
        ]);
    });
});
//# sourceMappingURL=NestedFacetAccessorSpec.js.map