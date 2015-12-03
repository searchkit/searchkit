var _ = require("lodash");
function BoolMust(val) {
    if (val === void 0) { val = []; }
    return { bool: { must: val } };
}
exports.BoolMust = BoolMust;
function SimpleQueryString(query, options) {
    if (options === void 0) { options = {}; }
    return {
        "simple_query_string": _.extend(options, {
            "query": query,
        })
    };
}
exports.SimpleQueryString = SimpleQueryString;
//# sourceMappingURL=Builders.js.map