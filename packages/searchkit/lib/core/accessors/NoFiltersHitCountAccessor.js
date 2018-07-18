var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Accessor_1 = require("./Accessor");
var query_1 = require("../query");
var NoFiltersHitCountAccessor = /** @class */ (function (_super) {
    __extends(NoFiltersHitCountAccessor, _super);
    function NoFiltersHitCountAccessor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.aggsKey = "no_filters_top_hits";
        return _this;
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
}(Accessor_1.Accessor));
exports.NoFiltersHitCountAccessor = NoFiltersHitCountAccessor;
//# sourceMappingURL=NoFiltersHitCountAccessor.js.map