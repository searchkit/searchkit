var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var state_1 = require("../state");
var FilterBasedAccessor_1 = require("./FilterBasedAccessor");
var _1 = require("../query/");
var map = require("lodash/map");
var each = require("lodash/each");
var compact = require("lodash/compact");
var take = require("lodash/take");
var HierarchicalFacetAccessor = (function (_super) {
    __extends(HierarchicalFacetAccessor, _super);
    function HierarchicalFacetAccessor(key, options) {
        _super.call(this, key);
        this.state = new state_1.LevelState();
        this.options = options;
        this.computeUuids();
    }
    HierarchicalFacetAccessor.prototype.computeUuids = function () {
        var _this = this;
        this.uuids = map(this.options.fields, function (field) { return _this.uuid + field; });
    };
    HierarchicalFacetAccessor.prototype.onResetFilters = function () {
        this.resetState();
    };
    HierarchicalFacetAccessor.prototype.getBuckets = function (level) {
        var field = this.options.fields[level];
        return this.getAggregations([this.options.id, field, field, "buckets"], []);
    };
    HierarchicalFacetAccessor.prototype.buildSharedQuery = function (query) {
        var _this = this;
        each(this.options.fields, function (field, i) {
            var filters = _this.state.getLevel(i);
            var parentFilter = _this.state.getLevel(i - 1);
            var isLeaf = !_this.state.levelHasFilters(i + 1);
            var filterTerms = map(filters, _1.TermQuery.bind(null, field));
            if (filterTerms.length > 0) {
                query = query.addFilter(_this.uuids[i], (filterTerms.length > 1) ?
                    _1.BoolShould(filterTerms) : filterTerms[0]);
            }
            if (isLeaf) {
                var selectedFilters = map(filters, function (filter) {
                    return {
                        id: _this.options.id,
                        name: _this.translate(parentFilter[0]) || _this.options.title || _this.translate(field),
                        value: _this.translate(filter),
                        remove: function () {
                            _this.state = _this.state.remove(i, filter);
                        }
                    };
                });
                query = query.addSelectedFilters(selectedFilters);
            }
        });
        return query;
    };
    HierarchicalFacetAccessor.prototype.buildOwnQuery = function (query) {
        var _this = this;
        var filters = this.state.getValue();
        var field = this.options.fields[0];
        var lvlAggs = compact(map(this.options.fields, function (field, i) {
            if (_this.state.levelHasFilters(i - 1) || i == 0) {
                return _1.FilterBucket(field, query.getFiltersWithKeys(take(_this.uuids, i)), _1.TermsBucket(field, field, { size: _this.options.size }));
            }
        }));
        var aggs = _1.FilterBucket.apply(void 0, [this.options.id, query.getFiltersWithoutKeys(this.uuids)].concat(lvlAggs));
        return query.setAggs(aggs);
    };
    return HierarchicalFacetAccessor;
})(FilterBasedAccessor_1.FilterBasedAccessor);
exports.HierarchicalFacetAccessor = HierarchicalFacetAccessor;
//# sourceMappingURL=HierarchicalFacetAccessor.js.map