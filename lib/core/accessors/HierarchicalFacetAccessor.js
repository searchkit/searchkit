var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var state_1 = require("../state");
var Accessor_1 = require("./Accessor");
var QueryBuilders_1 = require("../query/QueryBuilders");
var _ = require("lodash");
var HierarchicalFacetAccessor = (function (_super) {
    __extends(HierarchicalFacetAccessor, _super);
    function HierarchicalFacetAccessor(key, options) {
        _super.call(this, key);
        this.state = new state_1.LevelState();
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
        _.each(this.options.fields, function (field, i) {
            var filters = _this.state.getLevel(i);
            var parentFilter = _this.state.getLevel(i - 1);
            var filterTerms = _.map(filters, function (filter, idx) {
                return QueryBuilders_1.Term(field, filter, {
                    $name: _this.translate(parentFilter[0]) || _this.options.title || _this.translate(field),
                    $value: _this.translate(filter),
                    $id: _this.options.id,
                    $remove: function () {
                        _this.state = _this.state.remove(i, filter);
                    },
                    $disabled: _this.state.levelHasFilters(i + 1)
                });
            });
            if (filterTerms.length > 0) {
                query = query.addFilter(field, QueryBuilders_1.BoolShould(filterTerms));
            }
        });
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