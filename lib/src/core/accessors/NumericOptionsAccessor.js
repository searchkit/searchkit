var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var state_1 = require("../state");
var FilterBasedAccessor_1 = require("./FilterBasedAccessor");
var query_1 = require("../query");
var find = require("lodash/find");
var compact = require("lodash/compact");
var map = require("lodash/map");
var filter = require("lodash/filter");
var NumericOptionsAccessor = (function (_super) {
    __extends(NumericOptionsAccessor, _super);
    function NumericOptionsAccessor(key, options) {
        _super.call(this, key);
        this.state = new state_1.ValueState();
        this.options = options;
    }
    NumericOptionsAccessor.prototype.getBuckets = function () {
        return filter(this.getAggregations([this.key, this.key, "buckets"], []), this.emptyOptionsFilter);
    };
    NumericOptionsAccessor.prototype.emptyOptionsFilter = function (option) {
        return option.doc_count > 0;
    };
    NumericOptionsAccessor.prototype.buildSharedQuery = function (query) {
        var _this = this;
        if (this.state.hasValue()) {
            var val = find(this.options.options, { title: this.state.getValue() });
            var rangeFilter = query_1.RangeQuery(this.options.field, {
                gte: val.from, lt: val.to
            });
            var selectedFilter = {
                name: this.translate(this.options.title),
                value: this.translate(val.title),
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
    NumericOptionsAccessor.prototype.getRanges = function () {
        return compact(map(this.options.options, function (range) {
            return {
                key: range.title,
                from: range.from,
                to: range.to
            };
        }));
    };
    NumericOptionsAccessor.prototype.buildOwnQuery = function (query) {
        return query.setAggs(query_1.FilterBucket(this.key, query.getFiltersWithoutKeys(this.uuid), query_1.RangeBucket(this.key, this.options.field, this.getRanges())));
    };
    return NumericOptionsAccessor;
})(FilterBasedAccessor_1.FilterBasedAccessor);
exports.NumericOptionsAccessor = NumericOptionsAccessor;
//# sourceMappingURL=NumericOptionsAccessor.js.map