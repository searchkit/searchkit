Object.defineProperty(exports, "__esModule", { value: true });
var assign = require("lodash/assign");
var pick = require("lodash/pick");
var allowedOptions = ["score_mode", "inner_hits"];
function NestedQuery(path, query, options) {
    if (options === void 0) { options = {}; }
    return {
        nested: assign({
            path: path, query: query
        }, pick(options, allowedOptions))
    };
}
exports.NestedQuery = NestedQuery;
//# sourceMappingURL=NestedQuery.js.map