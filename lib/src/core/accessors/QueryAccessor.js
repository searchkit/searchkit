var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var state_1 = require("../state");
var StatefulAccessor_1 = require("./StatefulAccessor");
var query_1 = require("../query");
var QueryAccessor = (function (_super) {
    __extends(QueryAccessor, _super);
    function QueryAccessor(key, options) {
        if (options === void 0) { options = {}; }
        _super.call(this, key);
        this.state = new state_1.ValueState();
        this.options = options;
        this.options.queryFields = this.options.queryFields || ["_all"];
    }
    QueryAccessor.prototype.onQueryStringChange = function (queryString) {
        this.state = this.state.setValue(queryString);
    };
    QueryAccessor.prototype.buildSharedQuery = function (query) {
        var queryStr = this.state.getValue();
        if (queryStr) {
            var simpleQuery = query_1.SimpleQueryString(queryStr, _.extend({ fields: this.options.queryFields }, this.options.queryOptions));
            var queries = [simpleQuery];
            if (this.options.prefixQueryFields) {
                queries.push(query_1.MultiMatchQuery(queryStr, {
                    type: "phrase_prefix",
                    fields: this.options.prefixQueryFields
                }));
            }
            return query.addQuery(query_1.BoolShould(queries));
        }
        return query;
    };
    QueryAccessor.prototype.buildOwnQuery = function (query) {
        var queryText = this.state.getValue();
        if (!queryText || this.options.disableSuggestions)
            return query;
        return query.setSuggestions({
            text: queryText,
            suggestions: {
                phrase: {
                    field: "title",
                    real_word_error_likelihood: 0.95,
                    max_errors: 1,
                    gram_size: 4,
                    direct_generator: [{
                            field: "_all",
                            suggest_mode: "always",
                            min_word_length: 1
                        }]
                }
            }
        });
    };
    return QueryAccessor;
})(StatefulAccessor_1.StatefulAccessor);
exports.QueryAccessor = QueryAccessor;
//# sourceMappingURL=QueryAccessor.js.map