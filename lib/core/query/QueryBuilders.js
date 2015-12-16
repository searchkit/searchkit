var _ = require("lodash");
function BoolMust(val) {
    if (val === void 0) { val = []; }
    return { bool: { must: val }, $array: val };
}
exports.BoolMust = BoolMust;
function BoolMustNot(val) {
    if (val === void 0) { val = []; }
    return { bool: { must_not: val }, $array: val };
}
exports.BoolMustNot = BoolMustNot;
function BoolShould(val) {
    if (val === void 0) { val = []; }
    return { bool: { should: val }, $array: val };
}
exports.BoolShould = BoolShould;
function SimpleQueryString(query, options) {
    if (options === void 0) { options = {}; }
    if (!query) {
        return undefined;
    }
    var matchPhrase = {
        "match_phrase_prefix": _.extend(options, {
            "_all": query
        })
    };
    var simpleQuery = {
        "simple_query_string": {
            query: query
        }
    };
    return BoolShould([
        simpleQuery, matchPhrase
    ]);
}
exports.SimpleQueryString = SimpleQueryString;
function Term(key, value, options) {
    if (options === void 0) { options = {}; }
    var defaultOptions = {
        $disabled: true
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
function Range(key, from, to, options) {
    if (options === void 0) { options = {}; }
    var defaultOptions = {
        $disabled: true
    };
    return _.extend({
        range: (_a = {},
            _a[key] = {
                gte: from,
                lt: to
            },
            _a
        )
    }, defaultOptions, options);
    var _a;
}
exports.Range = Range;
//# sourceMappingURL=QueryBuilders.js.map