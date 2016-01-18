var AggsContainer_1 = require("./AggsContainer");
function CardinalityMetric(key, field) {
    return AggsContainer_1.AggsContainer(key, {
        cardinality: { field: field }
    });
}
exports.CardinalityMetric = CardinalityMetric;
function MinMetric(key, field) {
    return AggsContainer_1.AggsContainer(key, {
        min: { field: field }
    });
}
exports.MinMetric = MinMetric;
function TopHitsMetric(key, top_hits) {
    return AggsContainer_1.AggsContainer(key, { top_hits: top_hits });
}
exports.TopHitsMetric = TopHitsMetric;
//# sourceMappingURL=MetricAggregations.js.map