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
var state_1 = require("../state");
var FilterBasedAccessor_1 = require("./FilterBasedAccessor");
var _1 = require("../query/");
var map = require("lodash/map");
var each = require("lodash/each");
var compact = require("lodash/compact");
var take = require("lodash/take");
var omitBy = require("lodash/omitBy");
var isUndefined = require("lodash/isUndefined");
var HierarchicalFacetAccessor = /** @class */ (function (_super) {
    __extends(HierarchicalFacetAccessor, _super);
    function HierarchicalFacetAccessor(key, options) {
        var _this = _super.call(this, key) || this;
        _this.state = new state_1.LevelState();
        _this.options = options;
        _this.computeUuids();
        return _this;
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
        var buckets = this.getAggregations([this.options.id, field, field, "buckets"], []);
        return map(buckets, function (item) {
            item.key = String(item.key);
            return item;
        });
    };
    HierarchicalFacetAccessor.prototype.getOrder = function () {
        if (this.options.orderKey) {
            var orderDirection = this.options.orderDirection || "asc";
            return _a = {}, _a[this.options.orderKey] = orderDirection, _a;
        }
        var _a;
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
        var lvlAggs = compact(map(this.options.fields, function (field, i) {
            if (_this.state.levelHasFilters(i - 1) || i == 0) {
                return _1.FilterBucket(field, query.getFiltersWithKeys(take(_this.uuids, i)), _1.TermsBucket(field, field, omitBy({
                    size: _this.options.size, order: _this.getOrder()
                }, isUndefined)));
            }
        }));
        var aggs = _1.FilterBucket.apply(void 0, [this.options.id,
            query.getFiltersWithoutKeys(this.uuids)].concat(lvlAggs));
        return query.setAggs(aggs);
    };
    return HierarchicalFacetAccessor;
}(FilterBasedAccessor_1.FilterBasedAccessor));
exports.HierarchicalFacetAccessor = HierarchicalFacetAccessor;
//# sourceMappingURL=HierarchicalFacetAccessor.js.map