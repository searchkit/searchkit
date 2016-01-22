var _this = this;
var _1 = require("../../../../../");
describe("MetricAggregations", function () {
    beforeEach(function () {
        _this.testFieldMetric = function (Metric, op) {
            var aggs = Metric("key", "field");
            expect(aggs).toEqual({
                key: (_a = {},
                    _a[op] = { field: "field" },
                    _a
                )
            });
            var _a;
        };
    });
    it("CardinalityMetric", function () {
        _this.testFieldMetric(_1.CardinalityMetric, "cardinality");
    });
    it("MinMetric", function () {
        _this.testFieldMetric(_1.MinMetric, "min");
    });
    it("MaxMetric", function () {
        _this.testFieldMetric(_1.MaxMetric, "max");
    });
    it("AvgMetric", function () {
        _this.testFieldMetric(_1.AvgMetric, "avg");
    });
    it("SumMetric", function () {
        _this.testFieldMetric(_1.SumMetric, "sum");
    });
    it("TopHitsMetric", function () {
        expect(_1.TopHitsMetric("sometophits", {
            size: 1, _source: false
        })).toEqual({
            sometophits: {
                top_hits: {
                    size: 1, _source: false
                }
            }
        });
    });
    it("GeoBoundsMetric", function () {
        expect(_1.GeoBoundsMetric("bounds", "location"))
            .toEqual({
            bounds: {
                geo_bounds: {
                    field: "location"
                }
            }
        });
        expect(_1.GeoBoundsMetric("bounds", "location", { wrap_longitude: true })).toEqual({
            bounds: {
                geo_bounds: {
                    field: "location",
                    wrap_longitude: true
                }
            }
        });
    });
});
//# sourceMappingURL=MetricAggregationsSpec.js.map