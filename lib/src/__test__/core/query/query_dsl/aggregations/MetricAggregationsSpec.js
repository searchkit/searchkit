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
});
//# sourceMappingURL=MetricAggregationsSpec.js.map