var _this = this;
var _1 = require("../../../");
var _ = require("lodash");
describe("HierarchicalFacetAccessor", function () {
    beforeEach(function () {
        _this.searcher = new _1.Searcher(new _1.SearchkitManager('/'));
        _this.accessor = new _1.HierarchicalFacetAccessor("categories", {
            fields: ["lvl1", "lvl2", "lvl3"],
            id: "categories_id",
            title: "Categories",
            size: 20
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
                lvl2: {
                    lvl2: {
                        buckets: [1, 2, 3]
                    }
                },
                lvl3: {
                    lvl3: {
                        buckets: [4, 5, 6]
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
        var query = _this.accessor.buildSharedQuery(_this.query);
        var filters = _.chain(query.query.filter.$array)
            .pluck("$array")
            .flatten().value();
        expect(_this.toPlainObject(filters)).toEqual([
            {
                "term": {
                    "lvl1": "lvl1val"
                },
                "$disabled": true,
                "$name": "Categories",
                "$value": "lvl1val",
                "$id": "categories_id"
            },
            {
                "term": {
                    "lvl2": "lvl2val"
                },
                "$disabled": true,
                "$name": "lvl1val",
                "$value": "lvl2val",
                "$id": "categories_id"
            },
            {
                "term": {
                    "lvl3": "lvl3val"
                },
                "$disabled": false,
                "$name": "lvl2val",
                "$value": "lvl3val",
                "$id": "categories_id"
            }
        ]);
        filters[1].$remove();
        expect(_this.toPlainObject(_this.accessor.state.getValue()))
            .toEqual([['lvl1val'], [], ['lvl3val']]);
        filters[0].$remove();
        expect(_this.toPlainObject(_this.accessor.state.getValue()))
            .toEqual([[], [], ['lvl3val']]);
        filters[2].$remove();
        expect(_this.toPlainObject(_this.accessor.state.getValue()))
            .toEqual([[], [], []]);
        //check same query is returned when no filters exist
        var newQuery = _this.accessor.buildSharedQuery(query);
        expect(newQuery).toBe(query);
    });
    it("buildOwnQuery()", function () {
        var getFilters = function (aggs) {
            var filters = _.flatten(_.pluck(aggs.filter.$array, "$array"));
            return _.map(filters, function (f) { return _.pick(f, "term"); });
        };
        _this.accessor.state = _this.accessor.state
            .add(0, "lvl1val")
            .add(1, "lvl2val")
            .add(2, "lvl3val");
        var query = _this.accessor.buildSharedQuery(_this.query);
        query = _this.accessor.buildOwnQuery(query);
        //lvl1
        var aggs1 = query.query.aggs.lvl1;
        expect(getFilters(aggs1)).toEqual([]);
        expect(aggs1.aggs.lvl1.terms).toEqual({
            field: 'lvl1', size: 20
        });
        //lvl2
        var aggs2 = query.query.aggs.lvl2;
        expect(getFilters(aggs2)).toEqual([
            { term: { lvl1: "lvl1val" } }
        ]);
        expect(aggs2.aggs.lvl2.terms).toEqual({
            field: "lvl2", size: 20
        });
        //lvl3
        var aggs3 = query.query.aggs.lvl3;
        expect(getFilters(aggs3)).toEqual([
            { term: { lvl1: "lvl1val" } },
            { term: { lvl2: "lvl2val" } }
        ]);
        expect(aggs3.aggs.lvl3.terms).toEqual({
            field: "lvl3", size: 20
        });
    });
});
//# sourceMappingURL=HierarchicalFacetAccessorSpec.js.map