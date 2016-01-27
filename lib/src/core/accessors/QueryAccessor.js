var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BaseQueryAccessor_1 = require("./BaseQueryAccessor");
var query_1 = require("../query");
var assign = require("lodash/assign");
var QueryAccessor = (function (_super) {
    __extends(QueryAccessor, _super);
    function QueryAccessor(key, options) {
        if (options === void 0) { options = {}; }
        _super.call(this, key);
        this.options = options;
        this.options.queryFields = this.options.queryFields || ["_all"];
    }
    QueryAccessor.prototype.buildSharedQuery = function (query) {
        var queryStr = this.state.getValue();
        if (queryStr) {
            var simpleQuery = query_1.SimpleQueryString(queryStr, assign({ fields: this.options.queryFields }, this.options.queryOptions));
            var queries = [simpleQuery];
            if (this.options.prefixQueryFields) {
                queries.push(query_1.MultiMatchQuery(queryStr, {
                    type: "phrase_prefix",
                    fields: this.options.prefixQueryFields
                }));
            }
            return query.addQuery(query_1.BoolShould(queries))
                .setQueryString(queryStr);
        }
        return query;
    };
    return QueryAccessor;
})(BaseQueryAccessor_1.BaseQueryAccessor);
exports.QueryAccessor = QueryAccessor;
//# sourceMappingURL=QueryAccessor.js.map