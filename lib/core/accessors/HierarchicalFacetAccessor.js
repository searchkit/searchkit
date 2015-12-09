var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var State_1 = require("../state/State");
var Accessor_1 = require("./Accessor");
var QueryBuilders_1 = require("../query/QueryBuilders");
var _ = require("lodash");
var HierarchicalState = (function (_super) {
    __extends(HierarchicalState, _super);
    function HierarchicalState() {
        _super.apply(this, arguments);
    }
    HierarchicalState.prototype.lazyInit = function () {
        this.value = this.value || {};
        return this.value;
    };
    HierarchicalState.prototype.add = function (level, val) {
        var value = this.lazyInit();
        if (!_.isArray(value[level]))
            value[level] = [];
        value[level].push(val);
    };
    HierarchicalState.prototype.contains = function (level, val) {
        return _.contains(this.lazyInit()[level], val);
    };
    HierarchicalState.prototype.clear = function (level) {
        if (level) {
            var val = this.lazyInit()[level];
            val = [];
        }
        else {
            this.value = [];
        }
    };
    HierarchicalState.prototype.remove = function (level, val) {
        this.value = _.without(this.lazyInit()[level], val);
    };
    HierarchicalState.prototype.toggle = function (level, val) {
        if (this.contains(level, val)) {
            this.add(level, val);
        }
        else {
            this.remove(level, val);
        }
    };
    HierarchicalState.prototype.getLevel = function (level) {
        return this.lazyInit()[level] || [];
    };
    HierarchicalState.prototype.levelHasFilters = function (level) {
        return this.getLevel(level).length > 0;
    };
    return HierarchicalState;
})(State_1.ObjectState);
exports.HierarchicalState = HierarchicalState;
var HierarchicalFacetAccessor = (function (_super) {
    __extends(HierarchicalFacetAccessor, _super);
    function HierarchicalFacetAccessor(key, options) {
        _super.call(this, key);
        this.state = new HierarchicalState();
        this.options = options;
    }
    HierarchicalFacetAccessor.prototype.getBuckets = function (level) {
        var results = this.getResults();
        var field = this.options.fields[level];
        var path = ['aggregations', field, field, 'buckets'];
        return _.get(results, path, []);
    };
    HierarchicalFacetAccessor.prototype.buildSharedQuery = function (query) {
        var _this = this;
        console.log(this.state.getValue());
        var filters = this.state.getLevel(0);
        var filterTerms = _.map(filters, function (filter) {
            return QueryBuilders_1.Term(_this.options.fields[0], filter, {
                $name: _this.options.title || _this.options.fields[0],
                $value: filter,
                $remove: function () {
                    _this.state.remove(0, filter);
                }
            });
        });
        var boolBuilder = QueryBuilders_1.BoolShould;
        if (filterTerms.length > 0) {
            query = query.addFilter(this.options.fields[0], boolBuilder(filterTerms));
        }
        return query;
    };
    HierarchicalFacetAccessor.prototype.buildOwnQuery = function (query) {
        var _this = this;
        var filters = this.state.getValue();
        var field = this.options.fields[0];
        var aggs = {};
        _.each(this.options.fields, function (field, i) {
            if (_this.state.levelHasFilters(i - 1) || i == 0) {
                aggs[field] = {
                    filter: query.getFilters(_.slice(_this.options.fields, i)),
                    aggs: (_a = {},
                        _a[field] = QueryBuilders_1.Terms(field, { size: 20 }),
                        _a
                    )
                };
            }
            var _a;
        });
        query = query.setAggs(aggs);
        return query;
    };
    return HierarchicalFacetAccessor;
})(Accessor_1.Accessor);
exports.HierarchicalFacetAccessor = HierarchicalFacetAccessor;
//# sourceMappingURL=HierarchicalFacetAccessor.js.map