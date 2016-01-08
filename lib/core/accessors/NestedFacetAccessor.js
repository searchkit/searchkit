var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var state_1 = require("../state");
var Accessor_1 = require("./Accessor");
var QueryBuilders_1 = require("../query/QueryBuilders");
var NestedFacetAccessor = (function (_super) {
    __extends(NestedFacetAccessor, _super);
    function NestedFacetAccessor(key, options) {
        _super.call(this, key, options.id);
        this.state = new state_1.LevelState();
        this.options = options;
    }
    NestedFacetAccessor.prototype.getBuckets = function (level) {
        var results = this.getResults();
        var rpath = ['aggregations', this.key, "parents", "lvl" + level, "parents", 'buckets'];
        return _.get(results, rpath, []);
    };
    NestedFacetAccessor.prototype.buildSharedQuery = function (query) {
        var _this = this;
        var levelFilters = this.state.getValue();
        var lastIndex = levelFilters.length - 1;
        var filterTerms = _.map(levelFilters, function (filter, i) {
            var value = filter[0];
            var isLeaf = i === lastIndex;
            var subField = isLeaf ? ".value" : ".ancestors";
            return QueryBuilders_1.Term(_this.options.field + subField, value, {
                $name: _this.options.title || _this.translate(_this.key),
                $value: _this.translate(value),
                $id: _this.options.id,
                $disabled: !isLeaf,
                $remove: function () {
                    _this.state = _this.state.clear(i);
                }
            });
        });
        if (filterTerms.length > 0) {
            query = query.addFilter(this.options.field, QueryBuilders_1.NestedFilter(this.options.field, QueryBuilders_1.BoolMust(filterTerms)));
        }
        return query;
    };
    NestedFacetAccessor.prototype.getTermAggs = function () {
        var subAggs = undefined;
        var orderMetric = undefined;
        if (this.options.orderKey) {
            var orderDirection = this.options.orderDirection || "asc";
            var orderKey = this.options.orderKey;
            if (_.includes(["_count", "_term"], orderKey)) {
                orderMetric = (_a = {}, _a[orderKey] = orderDirection, _a);
            }
            else {
                if (_.startsWith(orderKey, this.options.field + ".")) {
                    var subAggName = this.options.field + "_order";
                    orderMetric = (_b = {},
                        _b[subAggName] = orderDirection,
                        _b
                    );
                    subAggs = (_c = {},
                        _c[subAggName] = {
                            "min": { field: orderKey }
                        },
                        _c
                    );
                }
            }
        }
        var valueField = this.options.field + ".value";
        return {
            parents: _.extend(QueryBuilders_1.Terms(valueField, { size: 0, order: orderMetric }), { aggs: subAggs })
        };
        var _a, _b, _c;
    };
    NestedFacetAccessor.prototype.buildOwnQuery = function (query) {
        var aggs = {};
        var levelField = this.options.field + ".level";
        var ancestorsField = this.options.field + ".ancestors";
        var startLevel = this.options.startLevel || 1;
        var termAggs = this.getTermAggs();
        var addLevel = function (level, ancestors) {
            if (ancestors === void 0) { ancestors = []; }
            _.extend(aggs, QueryBuilders_1.AggsList("lvl" + level, QueryBuilders_1.BoolMust([QueryBuilders_1.Term(levelField, level + startLevel)].concat(ancestors)), termAggs));
        };
        addLevel(0);
        var levels = this.state.getValue();
        _.each(levels, function (level, i) {
            var ancestors = _.map(_.take(levels, i + 1), function (level) {
                return QueryBuilders_1.Term(ancestorsField, level[0]);
            });
            addLevel(i + 1, ancestors);
        });
        query = query.setAggs((_a = {},
            _a[this.options.id] = {
                filter: query.getFilters(this.options.field),
                aggs: {
                    parents: {
                        nested: {
                            path: this.options.field
                        },
                        aggs: aggs
                    }
                }
            },
            _a
        ));
        return query;
        var _a;
    };
    return NestedFacetAccessor;
})(Accessor_1.Accessor);
exports.NestedFacetAccessor = NestedFacetAccessor;
//# sourceMappingURL=NestedFacetAccessor.js.map