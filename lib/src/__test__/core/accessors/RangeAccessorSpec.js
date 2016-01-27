var _this = this;
var _1 = require("../../../");
describe("RangeAccessor", function () {
    beforeEach(function () {
        _this.accessor = new _1.RangeAccessor("metascore", {
            title: "Metascore",
            id: "metascore",
            min: 0,
            max: 100,
            field: "metaScore"
        });
    });
    it("getBuckets()", function () {
        expect(_this.accessor.getBuckets()).toEqual([]);
        _this.accessor.results = {
            aggregations: {
                metascore: {
                    metascore: { buckets: [1, 2] }
                }
            }
        };
        expect(_this.accessor.getBuckets())
            .toEqual([1, 2]);
    });
    describe("build query", function () {
        it("buildSharedQuery()", function () {
            var query = new _1.ImmutableQuery();
            _this.accessor.state = new _1.ObjectState({ min: 20, max: 70 });
            query = _this.accessor.buildSharedQuery(query);
            expect(query.query.filter).toEqual(_1.RangeQuery("metaScore", { gte: 20, lte: 70 }));
            var selectedFilter = query.getSelectedFilters()[0];
            expect(selectedFilter).toEqual(jasmine.objectContaining({
                name: "Metascore", value: "20 - 70", id: "metascore"
            }));
            selectedFilter.remove();
            expect(_this.accessor.state.getValue()).toEqual({});
        });
        it("buildSharedQuery() - empty", function () {
            _this.accessor.state = new _1.ObjectState();
            var query = new _1.ImmutableQuery();
            var newQuery = _this.accessor.buildSharedQuery(query);
            expect(newQuery).toBe(query);
        });
    });
    describe("buildOwnQuery", function () {
        beforeEach(function () {
            _this.accessor.state = new _1.ObjectState({ min: 20, max: 70 });
            _this.query = new _1.ImmutableQuery()
                .addFilter("rating_uuid", _1.BoolShould(["PG"]));
            _this.query = _this.accessor.buildSharedQuery(_this.query);
        });
        it("build own query", function () {
            var query = _this.accessor.buildOwnQuery(_this.query);
            expect(query.query.aggs).toEqual(_1.FilterBucket("metascore", _1.BoolMust([
                _1.BoolMust([
                    _1.BoolShould(["PG"])
                ]),
                { range: {
                        metaScore: {
                            gte: 0, lte: 100
                        }
                    } }
            ]), _1.HistogramBucket("metascore", "metaScore", {
                interval: 5,
                min_doc_count: 0,
                extended_bounds: {
                    min: 0,
                    max: 100
                }
            })));
        });
    });
});
//# sourceMappingURL=RangeAccessorSpec.js.map