var _ = require("lodash");
function BoolMust(val) {
    if (val === void 0) { val = []; }
    return { bool: { must: val } };
}
exports.BoolMust = BoolMust;
function BoolShould(val) {
    if (val === void 0) { val = []; }
    return { bool: { should: val } };
}
exports.BoolShould = BoolShould;
function SimpleQueryString(query, options) {
    if (options === void 0) { options = {}; }
    if (!query) {
        return undefined;
    }
    return {
        "simple_query_string": _.extend(options, {
            "query": query,
        })
    };
}
exports.SimpleQueryString = SimpleQueryString;
function Term(key, value, options) {
    var defaultOptions = {
        $disabled: false
    };
    return _.extend({
        term: (_a = {},
            _a[key] = value,
            _a
        )
    }, defaultOptions, options);
    var _a;
}
exports.Term = Term;
function Terms(key, options) {
    return {
        terms: _.extend({
            field: key
        }, options)
    };
}
exports.Terms = Terms;
//# sourceMappingURL=QueryBuilders.js.map