var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var state_1 = require("../state");
var Accessor_1 = require("./Accessor");
var QueryBuilders_1 = require("../query/QueryBuilders");
var _ = require("lodash");
var FacetAccessor = (function (_super) {
    __extends(FacetAccessor, _super);
    function FacetAccessor(key, options) {
        _super.call(this, key, options.id);
        this.state = new state_1.ArrayState();
        this.options = options;
        this.defaultSize = options.size;
        this.size = this.defaultSize;
    }
    FacetAccessor.prototype.getBuckets = function () {
        var results = this.getResults();
        var path = ['aggregations', this.key, this.key, 'buckets'];
        return _.get(results, path, []);
    };
    FacetAccessor.prototype.setViewMoreOption = function (option) {
        this.size = option.size;
    };
    FacetAccessor.prototype.getMoreSizeOption = function () {
        var option = {
            size: 0,
            label: ""
        };
        var total = this.getCount();
        if (total <= this.defaultSize)
            return null;
        if (total <= this.size) {
            option = { size: this.defaultSize, label: this.translate("view less") };
        }
        else if ((this.size + 50) > total) {
            option = { size: total, label: this.translate("view all") };
        }
        else if ((this.size + 50) < total) {
            option = { size: this.size + 50, label: this.translate("view more") };
        }
        else if (total) {
            option = null;
        }
        return option;
    };
    FacetAccessor.prototype.getCount = function () {
        var key = this.key + "_count";
        var results = this.getResults();
        var path = ['aggregations', key, key, 'value'];
        return _.get(results, path, 0);
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
                $disabled: false,
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
        return query
            .setAggs(QueryBuilders_1.Aggs(this.key, query.getFilters(excludedKey), QueryBuilders_1.Terms(this.key, { size: this.size })))
            .setAggs(QueryBuilders_1.Aggs(this.key + "_count", query.getFilters(excludedKey), QueryBuilders_1.Cardinality(this.key)));
    };
    return FacetAccessor;
})(Accessor_1.Accessor);
exports.FacetAccessor = FacetAccessor;
//# sourceMappingURL=FacetAccessor.js.map