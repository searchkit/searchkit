var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Accessor_1 = require("./Accessor");
var query_1 = require("../query");
var NoFiltersHitCountAccessor = (function (_super) {
    __extends(NoFiltersHitCountAccessor, _super);
    function NoFiltersHitCountAccessor() {
        _super.apply(this, arguments);
        this.aggsKey = "no_filters_top_hits";
    }
    NoFiltersHitCountAccessor.prototype.getCount = function () {
        return this.getAggregations([this.aggsKey, "hits", "total"], 0);
    };
    NoFiltersHitCountAccessor.prototype.buildOwnQuery = function (query) {
        if (query.getQueryString() && query.getSelectedFilters().length > 0) {
            return query.setAggs(query_1.TopHitsMetric(this.aggsKey, {
                size: 1, _source: false
            }));
        }
        return query;
    };
    return NoFiltersHitCountAccessor;
})(Accessor_1.Accessor);
exports.NoFiltersHitCountAccessor = NoFiltersHitCountAccessor;
//# sourceMappingURL=NoFiltersHitCountAccessor.js.map