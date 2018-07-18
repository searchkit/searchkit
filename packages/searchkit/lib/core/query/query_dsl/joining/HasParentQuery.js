Object.defineProperty(exports, "__esModule", { value: true });
var assign = require("lodash/assign");
var pick = require("lodash/pick");
var allowedOptions = ["score_mode", "inner_hits"];
function HasParentQuery(parent_type, query, options) {
    if (options === void 0) { options = {}; }
    return {
        has_parent: assign({
            parent_type: parent_type, query: query
        }, pick(options, allowedOptions))
    };
}
exports.HasParentQuery = HasParentQuery;
//# sourceMappingURL=HasParentQuery.js.map