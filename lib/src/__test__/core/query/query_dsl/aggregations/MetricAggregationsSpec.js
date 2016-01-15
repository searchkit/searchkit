var _1 = require("../../../../../");
describe("MetricAggregations", function () {
    beforeEach(function () {
    });
    it("CardinalityMetric", function () {
        var aggs = _1.CardinalityMetric("genre_count", "genres");
        expect(aggs).toEqual({
            genre_count: {
                cardinality: {
                    field: "genres"
                }
            }
        });
    });
    it("MinMetric", function () {
        var aggs = _1.MinMetric("min_price", "prices");
        expect(aggs).toEqual({
            min_price: {
                min: {
                    field: "prices"
                }
            }
        });
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
});
//# sourceMappingURL=MetricAggregationsSpec.js.map