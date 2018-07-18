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
var identity = require("lodash/identity");
var maxBy = require("lodash/maxBy");
var get = require("lodash/get");
var assign = require("lodash/assign");
var query_1 = require("../query");
var RangeAccessor = /** @class */ (function (_super) {
    __extends(RangeAccessor, _super);
    function RangeAccessor(key, options) {
        var _this = _super.call(this, key, options.id) || this;
        _this.state = new state_1.ObjectState({});
        _this.translations = RangeAccessor.translations;
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
    RangeAccessor.prototype.getSelectedValue = function (value) {
        var divider = this.translate("range.divider");
        return [
            this.options.rangeFormatter(value.min),
            divider,
            this.options.rangeFormatter(value.max),
        ].join("");
    };
    RangeAccessor.prototype.buildSharedQuery = function (query) {
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
                .addFilter(this.uuid, rangeFilter)
                .addSelectedFilter(selectedFilter);
        }
        return query;
    };
    RangeAccessor.prototype.getBuckets = function () {
        return this.getAggregations([
            this.uuid,
            this.fieldContext.getAggregationPath(),
            this.key, "buckets"
        ], []);
    };
    RangeAccessor.prototype.isDisabled = function () {
        if (this.options.loadHistogram) {
            var maxValue = get(maxBy(this.getBuckets(), "doc_count"), "doc_count", 0);
            return maxValue === 0;
        }
        else {
            return this.getAggregations([
                this.uuid,
                this.fieldContext.getAggregationPath(),
                this.key, "value"
            ], 0) === 0;
        }
    };
    RangeAccessor.prototype.getInterval = function () {
        if (this.options.interval) {
            return this.options.interval;
        }
        return Math.ceil((this.options.max - this.options.min) / 20);
    };
    RangeAccessor.prototype.buildOwnQuery = function (query) {
        var otherFilters = query.getFiltersWithoutKeys(this.uuid);
        var filters = query_1.BoolMust([
            otherFilters,
            this.fieldContext.wrapFilter(query_1.RangeQuery(this.options.field, {
                gte: this.options.min, lte: this.options.max
            }))
        ]);
        var metric;
        if (this.options.loadHistogram) {
            metric = query_1.HistogramBucket(this.key, this.options.field, {
                "interval": this.getInterval(),
                "min_doc_count": 0,
                "extended_bounds": {
                    "min": this.options.min,
                    "max": this.options.max
                }
            });
        }
        else {
            metric = query_1.CardinalityMetric(this.key, this.options.field);
        }
        return query.setAggs(query_1.FilterBucket.apply(void 0, [this.uuid,
            filters].concat(this.fieldContext.wrapAggregations(metric))));
    };
    RangeAccessor.translations = {
        "range.divider": " - "
    };
    return RangeAccessor;
}(FilterBasedAccessor_1.FilterBasedAccessor));
exports.RangeAccessor = RangeAccessor;
//# sourceMappingURL=RangeAccessor.js.map