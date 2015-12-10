var update = require("react-addons-update");
var QueryBuilders_1 = require("./QueryBuilders");
var _ = require("lodash");
var ImmutableQuery = (function () {
    function ImmutableQuery(query, index) {
        if (query === void 0) { query = ImmutableQuery.defaultQuery; }
        if (index === void 0) { index = ImmutableQuery.defaultIndex; }
        this.index = index;
        this.query = query;
    }
    ImmutableQuery.prototype.hasFilters = function () {
        return !_.isEmpty(this.index.filters);
    };
    ImmutableQuery.prototype.hasFiltersOrQuery = function () {
        return (this.query.query.bool.must.length +
            this.query.filter.bool.must.length) > 0;
    };
    ImmutableQuery.prototype.addQuery = function (query) {
        if (query) {
            return this.update({
                query: QueryBuilders_1.BoolMust({ $push: [query] })
            });
        }
        return this;
    };
    ImmutableQuery.prototype.addFilter = function (key, bool) {
        var newIndex = update(this.index, {
            filters: {
                $merge: (_a = {}, _a[key] = bool, _a)
            },
            filtersArray: {
                $push: bool.bool.must || bool.bool.should
            }
        });
        return this.update({
            filter: QueryBuilders_1.BoolMust({ $push: [bool] })
        }, newIndex);
        var _a;
    };
    ImmutableQuery.prototype.getFiltersArray = function () {
        return this.index.filtersArray || [];
    };
    ImmutableQuery.prototype.setAggs = function (aggs) {
        return this.update({ $merge: { aggs: aggs } });
    };
    ImmutableQuery.prototype.getFilters = function (key) {
        if (key === void 0) { key = undefined; }
        if (!_.isArray(key)) {
            key = [key];
        }
        var filters = _.values(_.omit(this.index.filters || {}, key));
        return QueryBuilders_1.BoolMust(filters);
    };
    ImmutableQuery.prototype.setSize = function (size) {
        return this.update({ $merge: { size: size } });
    };
    ImmutableQuery.prototype.setFrom = function (from) {
        return this.update({ $merge: { from: from } });
    };
    ImmutableQuery.prototype.update = function (updateDef, newIndex) {
        if (newIndex === void 0) { newIndex = this.index; }
        return new ImmutableQuery(update(this.query, updateDef), newIndex);
    };
    ImmutableQuery.areQueriesDifferent = function (queryA, queryB) {
        if (!queryA || !queryB) {
            return true;
        }
        return !_.isEqual(queryA.getJSON(), queryB.getJSON());
    };
    ImmutableQuery.prototype.getJSON = function () {
        var replacer = function (key, value) {
            if (/^\$/.test(key)) {
                return undefined;
            }
            else {
                return value;
            }
        };
        return JSON.parse(JSON.stringify(this.query, replacer));
    };
    ImmutableQuery.defaultQuery = {
        filter: QueryBuilders_1.BoolMust([]),
        query: QueryBuilders_1.BoolMust([])
    };
    ImmutableQuery.defaultIndex = {
        filters: {},
        filtersArray: []
    };
    return ImmutableQuery;
})();
exports.ImmutableQuery = ImmutableQuery;
//# sourceMappingURL=ImmutableQuery.js.map