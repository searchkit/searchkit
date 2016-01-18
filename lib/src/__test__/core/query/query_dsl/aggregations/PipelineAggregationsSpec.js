var _1 = require("../../../../../");
describe("PipelineAggregations", function () {
    it("AvgBucketPipeline", function () {
        var aggs = _1.AvgBucketPipeline("avg_prices", "houses>price");
        expect(aggs).toEqual({
            avg_prices: {
                buckets_path: 'houses>price'
            }
        });
    });
});
//# sourceMappingURL=PipelineAggregationsSpec.js.map