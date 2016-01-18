var _this = this;
var _1 = require("../../../");
var _ = require("lodash");
describe("NoFiltersHitCountAccessor", function () {
    beforeEach(function () {
        _this.accessor = new _1.NoFiltersHitCountAccessor();
    });
    it("getCount()", function () {
        _this.accessor.results = {
            aggregations: {
                "no_filters_top_hits": {
                    hits: {
                        total: 2,
                        hits: [1, 2]
                    }
                }
            }
        };
        expect(_this.accessor.getCount()).toBe(2);
    });
    it("buildOwnQuery() - with no filters", function () {
        var query = new _1.ImmutableQuery();
        expect(_this.accessor.buildOwnQuery(query)).toBe(query);
    });
    it("buildOwnQuery()", function () {
        var query = new _1.ImmutableQuery().addSelectedFilter({
            id: "test", name: "test", value: "val", remove: _.identity
        }).setQueryString("foo");
        var newQuery = _this.accessor.buildOwnQuery(query);
        expect(newQuery).not.toBe(query);
        expect(newQuery.query.aggs)
            .toEqual(_1.TopHitsMetric("no_filters_top_hits", { size: 1, _source: false }));
    });
});
//# sourceMappingURL=NoFiltersHitCountAccessorSpec.js.map