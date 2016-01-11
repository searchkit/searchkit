var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var state_1 = require("../state");
var Accessor_1 = require("./Accessor");
var query_1 = require("../query");
var _ = require("lodash");
var NumericOptionsAccessor = (function (_super) {
    __extends(NumericOptionsAccessor, _super);
    function NumericOptionsAccessor(key, options) {
        _super.call(this, key);
        this.state = new state_1.ValueState();
        this.options = options;
    }
    NumericOptionsAccessor.prototype.getBuckets = function () {
        return this.getAggregations([this.key, this.key, "buckets"], []);
    };
    NumericOptionsAccessor.prototype.buildSharedQuery = function (query) {
        var _this = this;
        if (this.state.hasValue()) {
            var val = _.findWhere(this.options.options, { title: this.state.getValue() });
            var rangeFilter = query_1.RangeQuery(this.options.field, val.from, val.to);
            var selectedFilter = {
                name: this.translate(this.options.title),
                value: this.translate(val.title),
                id: this.options.id,
                remove: function () {
                    _this.state = _this.state.clear();
                }
            };
            return query
                .addFilter(this.uuid, query_1.BoolMust([rangeFilter]))
                .addSelectedFilter(selectedFilter);
        }
        return query;
    };
    NumericOptionsAccessor.prototype.getRanges = function () {
        return _.compact(_.map(this.options.options, function (range) {
            return {
                key: range.title,
                from: range.from,
                to: range.to
            };
        }));
    };
    NumericOptionsAccessor.prototype.buildOwnQuery = function (query) {
        return query.setAggs(query_1.FilterBucket(this.key, query.getFilters(this.key), query_1.RangeBucket(this.key, this.options.field, this.getRanges())));
    };
    return NumericOptionsAccessor;
})(Accessor_1.Accessor);
exports.NumericOptionsAccessor = NumericOptionsAccessor;
//# sourceMappingURL=NumericOptionsAccessor.js.map