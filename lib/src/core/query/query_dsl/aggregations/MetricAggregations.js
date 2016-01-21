var AggsContainer_1 = require("./AggsContainer");
var assign = require("lodash/assign");
function FieldMetricFactory(metricOp) {
    return function (key, field) {
        return AggsContainer_1.AggsContainer(key, (_a = {},
            _a[metricOp] = { field: field },
            _a
        ));
        var _a;
    };
}
exports.FieldMetricFactory = FieldMetricFactory;
exports.CardinalityMetric = FieldMetricFactory("cardinality");
exports.MinMetric = FieldMetricFactory("min");
exports.MaxMetric = FieldMetricFactory("max");
exports.AvgMetric = FieldMetricFactory("avg");
exports.SumMetric = FieldMetricFactory("sum");
function TopHitsMetric(key, top_hits) {
    return AggsContainer_1.AggsContainer(key, { top_hits: top_hits });
}
exports.TopHitsMetric = TopHitsMetric;
function GeoBoundsMetric(key, field, options) {
    if (options === void 0) { options = {}; }
    return AggsContainer_1.AggsContainer(key, { geo_bounds: assign({ field: field }, options) });
}
exports.GeoBoundsMetric = GeoBoundsMetric;
//# sourceMappingURL=MetricAggregations.js.map