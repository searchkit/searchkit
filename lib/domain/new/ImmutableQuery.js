var update = require("react-addons-update");
var Builders_ts_1 = require("./Builders.ts");
var ImmutableQuery = (function () {
    function ImmutableQuery(query, index) {
        if (query === void 0) { query = ImmutableQuery.defaultQuery; }
        if (index === void 0) { index = {}; }
        this.index = index;
        this.query = query;
    }
    ImmutableQuery.prototype.addQuery = function (query) {
        return this.update({
            query: Builders_ts_1.BoolMust({ $merge: [query] })
        });
    };
    ImmutableQuery.prototype.addFilter = function (key, bool) {
        var addedIndex = { filters: (_a = {}, _a[key] = bool, _a) };
        var newIndex = _.extend({}, addedIndex);
        return this.update({
            filter: Builders_ts_1.BoolMust({ $merge: [bool] })
        }, newIndex);
        var _a;
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
        return { bool: { must: filters } };
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
            if (/^\$\$/.test(key)) {
                return undefined;
            }
            else {
                return value;
            }
        };
        return JSON.parse(JSON.stringify(this.query, replacer));
    };
    ImmutableQuery.defaultQuery = {
        filter: Builders_ts_1.BoolMust([]),
        query: Builders_ts_1.BoolMust([])
    };
    return ImmutableQuery;
})();
exports.ImmutableQuery = ImmutableQuery;
//# sourceMappingURL=ImmutableQuery.js.map