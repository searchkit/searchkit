var assign = require("lodash/assign");
function MultiMatchQuery(query, options) {
    if (!query) {
        return;
    }
    return {
        multi_match: assign({ query: query }, options)
    };
}
exports.MultiMatchQuery = MultiMatchQuery;
//# sourceMappingURL=MultiMatchQuery.js.map