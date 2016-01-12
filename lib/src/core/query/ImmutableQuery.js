var update = require("react-addons-update");
var query_dsl_1 = require("./query_dsl");
var _ = require("lodash");
var Utils_1 = require("../support/Utils");
var ImmutableQuery = (function () {
    function ImmutableQuery(index) {
        if (index === void 0) { index = ImmutableQuery.defaultIndex; }
        this.index = index;
        this.buildQuery();
    }
    ImmutableQuery.prototype.buildQuery = function () {
        var query = {};
        if (this.index.queries.length > 0) {
            query.query = query_dsl_1.BoolMust(this.index.queries);
        }
        if (this.index.filters.length > 0) {
            query.filter = query_dsl_1.BoolMust(this.index.filters);
        }
        query.aggs = this.index.aggs;
        query.size = this.index.size;
        query.from = this.index.from;
        query.sort = this.index.sort;
        query.highlight = this.index.highlight;
        this.query = _.omit(query, function (v) { return v === undefined; });
    };
    ImmutableQuery.prototype.hasFilters = function () {
        return this.index.filters.length > 0;
    };
    ImmutableQuery.prototype.hasFiltersOrQuery = function () {
        return (this.index.queries.length +
            this.index.filters.length) > 0 || !!this.index.sort;
    };
    ImmutableQuery.prototype.addQuery = function (query) {
        if (!query) {
            return this;
        }
        return this.update({
            queries: { $push: [query] }
        });
    };
    ImmutableQuery.prototype.addSelectedFilter = function (selectedFilter) {
        return this.addSelectedFilters([selectedFilter]);
    };
    ImmutableQuery.prototype.addSelectedFilters = function (selectedFilters) {
        return this.update({
            selectedFilters: { $push: selectedFilters }
        });
    };
    ImmutableQuery.prototype.getSelectedFilters = function () {
        return this.index.selectedFilters;
    };
    ImmutableQuery.prototype.addAnonymousFilter = function (bool) {
        return this.addFilter(Utils_1.Utils.guid(), bool);
    };
    ImmutableQuery.prototype.addFilter = function (key, filter) {
        return this.update({
            filters: { $push: [filter] },
            filtersMap: { $merge: (_a = {}, _a[key] = filter, _a) }
        });
        var _a;
    };
    ImmutableQuery.prototype.setAggs = function (aggs) {
        return this.deepUpdate("aggs", aggs);
    };
    ImmutableQuery.prototype.getFilters = function (keys) {
        return this.getFiltersWithoutKeys(keys);
    };
    ImmutableQuery.prototype._getFilters = function (keys, method) {
        keys = [].concat(keys);
        var filters = _.values(method(this.index.filtersMap || {}, keys));
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
    ImmutableQuery.prototype.setHighlight = function (highlight) {
        return this.deepUpdate("highlight", highlight);
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
    ImmutableQuery.prototype.deepUpdate = function (key, ob) {
        return this.update({
            $merge: (_a = {},
                _a[key] = _.merge({}, this.index[key] || {}, ob),
                _a
            )
        });
        var _a;
    };
    ImmutableQuery.prototype.update = function (updateDef) {
        return new ImmutableQuery(update(this.index, updateDef));
    };
    ImmutableQuery.prototype.getJSON = function () {
        return this.query;
    };
    ImmutableQuery.defaultIndex = {
        filtersMap: {},
        selectedFilters: [],
        queries: [],
        filters: [],
        size: 0
    };
    return ImmutableQuery;
})();
exports.ImmutableQuery = ImmutableQuery;
//# sourceMappingURL=ImmutableQuery.js.map