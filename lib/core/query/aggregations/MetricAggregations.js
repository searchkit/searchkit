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
//# sourceMappingURL=MetricAggregations.js.map