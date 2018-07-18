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
var FilterBasedAccessor_1 = require("./FilterBasedAccessor");
var state_1 = require("../state");
var query_1 = require("../query");
var assign = require("lodash/assign");
var identity = require("lodash/identity");
var DynamicRangeAccessor = /** @class */ (function (_super) {
    __extends(DynamicRangeAccessor, _super);
    function DynamicRangeAccessor(key, options) {
        var _this = _super.call(this, key, options.id) || this;
        _this.state = new state_1.ObjectState({});
        _this.translations = DynamicRangeAccessor.translations;
        _this.options = options;
        _this.options.fieldOptions = _this.options.fieldOptions || { type: "embedded" };
        _this.options.fieldOptions.field = _this.options.field;
        _this.fieldContext = query_1.FieldContextFactory(_this.options.fieldOptions);
        _this.options.rangeFormatter = _this.options.rangeFormatter || identity;
        if (options.translations) {
            _this.translations = assign({}, _this.translations, options.translations);
        }
        return _this;
    }
    DynamicRangeAccessor.prototype.getSelectedValue = function (value) {
        var divider = this.translate("range.divider");
        return [
            this.options.rangeFormatter(value.min),
            divider,
            this.options.rangeFormatter(value.max),
        ].join("");
    };
    DynamicRangeAccessor.prototype.buildSharedQuery = function (query) {
        var _this = this;
        if (this.state.hasValue()) {
            var val = this.state.getValue();
            var rangeFilter = this.fieldContext.wrapFilter(query_1.RangeQuery(this.options.field, {
                gte: val.min, lte: val.max
            }));
            var selectedFilter = {
                name: this.translate(this.options.title),
                value: this.getSelectedValue(val),
                id: this.options.id,
                remove: function () {
                    _this.state = _this.state.clear();
                }
            };
            return query
                .addFilter(this.key, rangeFilter)
                .addSelectedFilter(selectedFilter);
        }
        return query;
    };
    DynamicRangeAccessor.prototype.getStat = function (stat) {
        return this.getAggregations([
            this.key,
            this.fieldContext.getAggregationPath(),
            this.key, stat
        ], 0);
    };
    DynamicRangeAccessor.prototype.isDisabled = function () {
        return (this.getStat("count") === 0) || (this.getStat("min") === this.getStat("max"));
    };
    DynamicRangeAccessor.prototype.buildOwnQuery = function (query) {
        var otherFilters = query.getFiltersWithoutKeys(this.key);
        return query.setAggs(query_1.FilterBucket.apply(void 0, [this.key,
            otherFilters].concat(this.fieldContext.wrapAggregations(query_1.StatsMetric(this.key, this.options.field)))));
    };
    DynamicRangeAccessor.translations = {
        "range.divider": " - "
    };
    return DynamicRangeAccessor;
}(FilterBasedAccessor_1.FilterBasedAccessor));
exports.DynamicRangeAccessor = DynamicRangeAccessor;
//# sourceMappingURL=DynamicRangeAccessor.js.map