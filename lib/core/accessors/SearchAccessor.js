var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var state_1 = require("../state");
var Accessor_1 = require("./Accessor");
var query_1 = require("../query");
var SearchAccessor = (function (_super) {
    __extends(SearchAccessor, _super);
    function SearchAccessor(key, options) {
        if (options === void 0) { options = {}; }
        _super.call(this, key);
        this.state = new state_1.ValueState();
        this.options = options;
        this.options.queryFields = this.options.queryFields || ["_all"];
    }
    SearchAccessor.prototype.buildSharedQuery = function (query) {
        var queryStr = this.state.getValue();
        if (queryStr) {
            var simpleQuery = query_1.SimpleQueryString(queryStr, _.extend({}, this.options.queryOptions, {
                "query": queryStr,
                "fields": this.options.queryFields
            }));
            var prefixQueries = this.options.prefixQueryFields ? query_1.BoolShould(_.map(this.options.prefixQueryFields, query_1.MatchPhrasePrefix.bind(null, queryStr))) : [];
            var queries = [].concat(prefixQueries).concat(simpleQuery);
            return query.addQuery(query_1.BoolShould(queries));
        }
        return query;
    };
    return SearchAccessor;
})(Accessor_1.Accessor);
exports.SearchAccessor = SearchAccessor;
//# sourceMappingURL=SearchAccessor.js.map