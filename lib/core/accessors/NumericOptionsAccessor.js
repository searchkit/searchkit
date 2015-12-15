var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var state_1 = require("../state");
var Accessor_1 = require("./Accessor");
var QueryBuilders_1 = require("../query/QueryBuilders");
var _ = require("lodash");
var NumericOptionsAccessor = (function (_super) {
    __extends(NumericOptionsAccessor, _super);
    function NumericOptionsAccessor(key, options) {
        _super.call(this, key);
        this.state = new state_1.ValueState();
        this.options = options;
    }
    NumericOptionsAccessor.prototype.getBuckets = function () {
        var results = this.getResults();
        var path = ['aggregations', this.key, this.key, 'buckets'];
        return _.get(results, path, []);
    };
    NumericOptionsAccessor.prototype.buildSharedQuery = function (query) {
        var _this = this;
        if (this.state.hasValue()) {
            var val = _.findWhere(this.options.options, { title: this.state.getValue() });
            var rangeFilter = QueryBuilders_1.Range(this.options.field, val.from, val.to, {
                $name: this.translate(this.options.title),
                $value: this.translate(val.title),
                $id: this.options.id,
                $remove: function () {
                    _this.state = _this.state.clear();
                },
                $disabled: false
            });
            query = query.addFilter(this.key, QueryBuilders_1.BoolMust([rangeFilter]));
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
        query = query.setAggs((_a = {},
            _a[this.key] = {
                filter: query.getFilters(this.key),
                aggs: (_b = {},
                    _b[this.key] = {
                        "range": {
                            "field": this.options.field,
                            "ranges": this.getRanges()
                        }
                    },
                    _b
                )
            },
            _a
        ));
        return query;
        var _a, _b;
    };
    return NumericOptionsAccessor;
})(Accessor_1.Accessor);
exports.NumericOptionsAccessor = NumericOptionsAccessor;
//# sourceMappingURL=NumericOptionsAccessor.js.map