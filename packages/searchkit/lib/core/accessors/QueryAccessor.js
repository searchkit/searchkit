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
var BaseQueryAccessor_1 = require("./BaseQueryAccessor");
var query_1 = require("../query");
var assign = require("lodash/assign");
var QueryAccessor = /** @class */ (function (_super) {
    __extends(QueryAccessor, _super);
    function QueryAccessor(key, options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, key) || this;
        _this.options = options;
        _this.options.queryFields = _this.options.queryFields || ["_all"];
        return _this;
    }
    QueryAccessor.prototype.fromQueryObject = function (ob) {
        _super.prototype.fromQueryObject.call(this, ob);
        if (this.options.onQueryStateChange) {
            this.options.onQueryStateChange();
        }
    };
    QueryAccessor.prototype.buildSharedQuery = function (query) {
        var _this = this;
        var queryStr = this.state.getValue();
        if (queryStr) {
            var queryBuilder = this.options.queryBuilder || query_1.SimpleQueryString;
            var simpleQuery = queryBuilder(queryStr, assign({ fields: this.options.queryFields }, this.options.queryOptions));
            var queries = [simpleQuery];
            if (this.options.prefixQueryFields) {
                queries.push(query_1.MultiMatchQuery(queryStr, assign(this.options.prefixQueryOptions, {
                    type: "phrase_prefix",
                    fields: this.options.prefixQueryFields,
                })));
            }
            query = query.addQuery(query_1.BoolShould(queries));
            if (this.options.addToFilters) {
                query = query.addSelectedFilter({
                    name: this.options.title,
                    value: queryStr,
                    id: this.key,
                    remove: function () { return _this.state = _this.state.clear(); }
                });
            }
            else {
                query = query.setQueryString(queryStr);
            }
            return query;
        }
        return query;
    };
    return QueryAccessor;
}(BaseQueryAccessor_1.BaseQueryAccessor));
exports.QueryAccessor = QueryAccessor;
//# sourceMappingURL=QueryAccessor.js.map