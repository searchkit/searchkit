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
function MatchPhrasePrefix(query, str) {
    var tokens = str.split("^");
    var field = tokens[0];
    var boost = Number(tokens[1] || 1);
    return {
        "match_phrase_prefix": (_a = {},
            _a[field] = { query: query, boost: boost },
            _a
        )
    };
    var _a;
}
exports.MatchPhrasePrefix = MatchPhrasePrefix;
function SimpleQueryString(query, options) {
    if (options === void 0) { options = {}; }
    if (!query) {
        return undefined;
    }
    return {
        "simple_query_string": _.extend({}, options, {
            query: query
        })
    };
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
    if (options === void 0) { options = {}; }
    return {
        terms: _.extend({
            field: key
        }, options)
    };
}
exports.Terms = Terms;
function Cardinality(key) {
    return {
        cardinality: {
            field: key
        }
    };
}
exports.Cardinality = Cardinality;
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
function AggsRange(field, ranges) {
    return {
        "range": {
            field: field, ranges: ranges
        }
    };
}
exports.AggsRange = AggsRange;
function Aggs(key, filters, aggregation) {
    return (_a = {},
        _a[key] = {
            filter: filters,
            aggs: (_b = {},
                _b[key] = aggregation,
                _b
            )
        },
        _a
    );
    var _a, _b;
}
exports.Aggs = Aggs;
//# sourceMappingURL=QueryBuilders.js.map