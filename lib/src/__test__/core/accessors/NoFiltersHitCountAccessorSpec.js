var _this = this;
var _1 = require("../../../");
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
    it("buildOwnQuery()", function () {
        var query = _this.accessor.buildOwnQuery(new _1.ImmutableQuery());
        expect(query.query.aggs)
            .toEqual(_1.TopHitsMetric("no_filters_top_hits", { size: 1, _source: false }));
    });
});
//# sourceMappingURL=NoFiltersHitCountAccessorSpec.js.map