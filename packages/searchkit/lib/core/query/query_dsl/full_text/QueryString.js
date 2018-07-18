Object.defineProperty(exports, "__esModule", { value: true });
var assign = require("lodash/assign");
function QueryString(query, options) {
    if (options === void 0) { options = {}; }
    if (!query) {
        return;
    }
    return {
        "query_string": assign({ query: query }, options)
    };
}
exports.QueryString = QueryString;
//# sourceMappingURL=QueryString.js.map