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
        var rpath = ['aggregations', this.key, "lvl" + level, "parents", 'buckets'];
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
    NestedFacetAccessor.prototype.buildOwnQuery = function (query) {
        var aggs = {};
        var levelField = this.options.field + ".level";
        var ancestorsField = this.options.field + ".ancestors";
        var valueField = this.options.field + ".value";
        _.extend(aggs, QueryBuilders_1.AggsList("lvl0", QueryBuilders_1.BoolMust([QueryBuilders_1.Term(levelField, 1)]), { parents: QueryBuilders_1.Terms(valueField, { size: 0 }) }));
        var levels = this.state.getValue();
        _.each(levels, function (level, i) {
            var ancestors = _.map(_.take(levels, i + 1), function (level) {
                return QueryBuilders_1.Term(ancestorsField, level[0]);
            });
            _.extend(aggs, QueryBuilders_1.AggsList("lvl" + (i + 1), QueryBuilders_1.BoolMust([QueryBuilders_1.Term(levelField, i + 2)].concat(ancestors)), { parents: QueryBuilders_1.Terms(valueField, { size: 0 }) }));
        });
        query = query.setAggs((_a = {},
            _a[this.options.id] = {
                nested: {
                    path: this.options.field
                },
                aggs: aggs
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