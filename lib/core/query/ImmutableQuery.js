var update = require("react-addons-update");
var query_dsl_1 = require("./query_dsl");
var _ = require("lodash");
var Utils_1 = require("../support/Utils");
var ImmutableQuery = (function () {
    function ImmutableQuery(query, index) {
        if (query === void 0) { query = ImmutableQuery.defaultQuery; }
        if (index === void 0) { index = ImmutableQuery.defaultIndex; }
        this.query = query;
        this.index = index;
    }
    ImmutableQuery.prototype.hasFilters = function () {
        return !_.isEmpty(this.index.filters);
    };
    ImmutableQuery.prototype.hasFiltersOrQuery = function () {
        return (this.query.query.bool.must.length +
            this.query.filter.bool.must.length) > 0 || !!this.query.sort;
    };
    ImmutableQuery.prototype.addQuery = function (query) {
        if (query) {
            return this.update({
                query: query_dsl_1.BoolMust({ $push: [query] })
            });
        }
        return this;
    };
    ImmutableQuery.prototype.addSelectedFilter = function (selectedFilter) {
        return this.addSelectedFilters([selectedFilter]);
    };
    ImmutableQuery.prototype.addSelectedFilters = function (selectedFilters) {
        return new ImmutableQuery(this.query, update(this.index, {
            selectedFilters: { $push: selectedFilters }
        }));
    };
    ImmutableQuery.prototype.getSelectedFilters = function () {
        return this.index.selectedFilters;
    };
    ImmutableQuery.prototype.addAnonymousFilter = function (bool) {
        return this.addFilter(Utils_1.Utils.guid(), bool);
    };
    ImmutableQuery.prototype.addFilter = function (key, bool) {
        var newIndex = update(this.index, {
            filters: {
                $merge: (_a = {}, _a[key] = bool, _a)
            }
        });
        return this.update({
            filter: query_dsl_1.BoolMust({ $push: [bool] })
        }, newIndex);
        var _a;
    };
    ImmutableQuery.prototype.setAggs = function (aggs) {
        var existingAggs = this.query.aggs || {};
        var newAggs = _.extend({}, existingAggs, aggs);
        return this.update({ $merge: { aggs: newAggs } });
    };
    ImmutableQuery.prototype.getFilters = function (keys) {
        return this.getFiltersWithoutKeys(keys);
    };
    ImmutableQuery.prototype._getFilters = function (keys, method) {
        keys = [].concat(keys);
        var filters = _.values(method(this.index.filters || {}, keys));
        return query_dsl_1.BoolMust(filters);
    };
    ImmutableQuery.prototype.getFiltersWithKeys = function (keys) {
        return this._getFilters(keys, _.pick);
    };
    ImmutableQuery.prototype.getFiltersWithoutKeys = function (keys) {
        return this._getFilters(keys, _.omit);
    };
    ImmutableQuery.prototype.setSize = function (size) {
        return this.update({ $merge: { size: size } });
    };
    ImmutableQuery.prototype.setSort = function (sort) {
        return this.update({ $merge: { sort: sort } });
    };
    ImmutableQuery.prototype.getSize = function () {
        return this.query.size;
    };
    ImmutableQuery.prototype.setFrom = function (from) {
        return this.update({ $merge: { from: from } });
    };
    ImmutableQuery.prototype.getFrom = function () {
        return this.query.from;
    };
    ImmutableQuery.prototype.update = function (updateDef, newIndex) {
        if (newIndex === void 0) { newIndex = this.index; }
        return new ImmutableQuery(update(this.query, updateDef), newIndex);
    };
    ImmutableQuery.prototype.getJSON = function () {
        return this.query;
    };
    ImmutableQuery.defaultQuery = {
        filter: query_dsl_1.BoolMust([]),
        query: query_dsl_1.BoolMust([]),
        size: 0
    };
    ImmutableQuery.defaultIndex = {
        filters: {},
        selectedFilters: []
    };
    return ImmutableQuery;
})();
exports.ImmutableQuery = ImmutableQuery;
//# sourceMappingURL=ImmutableQuery.js.map