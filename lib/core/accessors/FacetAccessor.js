var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var State_1 = require("../state/State");
var Accessor_1 = require("./Accessor");
var QueryBuilders_1 = require("../query/QueryBuilders");
var _ = require("lodash");
var FacetAccessor = (function (_super) {
    __extends(FacetAccessor, _super);
    function FacetAccessor(key, options) {
        _super.call(this, key, options.id);
        this.state = new State_1.ArrayState();
        this.options = options;
    }
    FacetAccessor.prototype.getBuckets = function () {
        var results = this.getResults();
        var path = ['aggregations', this.key, this.key, 'buckets'];
        return _.get(results, path, []);
    };
    FacetAccessor.prototype.isOrOperator = function () {
        return this.options.operator === "OR";
    };
    FacetAccessor.prototype.getBoolBuilder = function () {
        return this.isOrOperator() ? QueryBuilders_1.BoolShould : QueryBuilders_1.BoolMust;
    };
    FacetAccessor.prototype.buildSharedQuery = function (query) {
        var _this = this;
        var filters = this.state.getValue();
        var filterTerms = _.map(filters, function (filter) {
            return QueryBuilders_1.Term(_this.key, filter, {
                $name: _this.options.title || _this.translate(_this.key),
                $value: _this.translate(filter),
                $id: _this.options.id,
                $remove: function () {
                    _this.state = _this.state.remove(filter);
                }
            });
        });
        var boolBuilder = this.getBoolBuilder();
        if (filterTerms.length > 0) {
            query = query.addFilter(this.key, boolBuilder(filterTerms));
        }
        return query;
    };
    FacetAccessor.prototype.buildOwnQuery = function (query) {
        var filters = this.state.getValue();
        var excludedKey = (this.isOrOperator()) ? this.key : undefined;
        query = query.setAggs((_a = {},
            _a[this.key] = {
                filter: query.getFilters(excludedKey),
                aggs: (_b = {},
                    _b[this.key] = QueryBuilders_1.Terms(this.key, { size: 20 }),
                    _b
                )
            },
            _a
        ));
        return query;
        var _a, _b;
    };
    return FacetAccessor;
})(Accessor_1.Accessor);
exports.FacetAccessor = FacetAccessor;
//# sourceMappingURL=FacetAccessor.js.map