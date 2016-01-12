var _ = require("lodash");
function SimpleQueryString(query, options) {
    if (options === void 0) { options = {}; }
    if (!query) {
        return;
    }
    return {
        "simple_query_string": _.extend({ query: query }, options)
    };
}
exports.SimpleQueryString = SimpleQueryString;
//# sourceMappingURL=SimpleQueryString.js.map